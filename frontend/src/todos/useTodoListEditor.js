import { useRef, useState } from 'react'
import { createTodo, updateTodo, deleteTodo } from './api'

const SAVE_DEBOUNCE_MS = 500

const createTodoDrafts = (todos) =>
  todos.map(({ id, text }) => ({
    key: id,
    id,
    text,
  }))

export const useTodoListEditor = (todoList, saveTodoListTitle) => {
  const [title, setTitle] = useState(todoList.title)
  const [todos, setTodos] = useState(() => createTodoDrafts(todoList.todos))
  const [savingTodoKeys, setSavingTodoKeys] = useState(() => new Set())
  const [error, setError] = useState('')
  const nextTodoKey = useRef(0)
  const todoOperations = useRef(new Map())
  const titleOperation = useRef({
    queue: Promise.resolve(),
    version: 0,
    savedVersion: 0,
    timer: null,
    text: todoList.title,
  })

  const setTodoSaving = (key, isSaving) => {
    setSavingTodoKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys)
      if (isSaving) nextKeys.add(key)
      else nextKeys.delete(key)
      return nextKeys
    })
  }

  const getTodoOperation = (todo) => {
    let operation = todoOperations.current.get(todo.key)
    if (!operation) {
      operation = {
        serverId: todo.id,
        queue: Promise.resolve(),
        version: 0,
        savedVersion: 0,
        timer: null,
        text: todo.text,
        deleted: false,
      }
      todoOperations.current.set(todo.key, operation)
    }
    return operation
  }

  const saveTodoVersion = (todo, operation, version) => {
    const text = operation.text
    const request = operation.queue.then(async () => {
      if (operation.deleted || version <= operation.savedVersion) return
      if (!operation.serverId && !text.trim()) {
        operation.savedVersion = version
        if (operation.version === version) {
          setTodoSaving(todo.key, false)
        }
        return
      }

      try {
        if (operation.serverId) {
          await updateTodo(todoList.id, operation.serverId, text)
        } else {
          const createdTodo = await createTodo(todoList.id, text.trim())
          operation.serverId = createdTodo.id
          if (!operation.deleted) {
            setTodos((currentTodos) =>
              currentTodos.map((currentTodo) =>
                currentTodo.key === todo.key ? { ...currentTodo, id: createdTodo.id } : currentTodo,
              ),
            )
          }
        }
        operation.savedVersion = version
        if (operation.version === version) {
          setTodoSaving(todo.key, false)
          setError('')
        }
      } catch (requestError) {
        if (operation.version === version) {
          setTodoSaving(todo.key, false)
          setError(requestError.message)
        }
      }
    })
    operation.queue = request
    return request
  }

  const commitTodo = (todo, operation) => {
    if (operation.timer) {
      clearTimeout(operation.timer)
      operation.timer = null
    }
    return saveTodoVersion(todo, operation, operation.version)
  }

  const commitTodoText = (todo) => commitTodo(todo, getTodoOperation(todo))

  const scheduleTodoSave = (todo, text) => {
    const operation = getTodoOperation(todo)
    operation.text = text
    operation.version += 1
    operation.deleted = false
    setTodoSaving(todo.key, true)
    setError('')
    if (operation.timer) clearTimeout(operation.timer)
    operation.timer = setTimeout(() => {
      operation.timer = null
      saveTodoVersion(todo, operation, operation.version)
    }, SAVE_DEBOUNCE_MS)
  }

  const saveTitleVersion = (version) => {
    const operation = titleOperation.current
    const nextTitle = operation.text.trim()
    const request = operation.queue.then(async () => {
      if (version <= operation.savedVersion) return
      if (!nextTitle) {
        if (operation.version === version) {
          setError('List title must not be empty.')
        }
        return
      }

      try {
        await saveTodoListTitle(todoList.id, nextTitle)
        operation.savedVersion = version
        if (operation.version === version) {
          setError('')
        }
      } catch (requestError) {
        if (operation.version === version) {
          setError(requestError.message)
        }
      }
    })
    operation.queue = request
    return request
  }

  const commitTitle = () => {
    const operation = titleOperation.current
    if (operation.timer) {
      clearTimeout(operation.timer)
      operation.timer = null
    }
    return saveTitleVersion(operation.version)
  }

  const scheduleTitleSave = (text) => {
    const operation = titleOperation.current
    operation.text = text
    operation.version += 1
    setError('')
    if (operation.timer) clearTimeout(operation.timer)
    operation.timer = setTimeout(() => {
      operation.timer = null
      saveTitleVersion(operation.version)
    }, SAVE_DEBOUNCE_MS)
  }

  const handleDeleteTodo = async (todo) => {
    const operation = getTodoOperation(todo)
    if (operation.timer) {
      clearTimeout(operation.timer)
      operation.timer = null
    }
    operation.deleted = true
    setTodoSaving(todo.key, false)
    setTodos((currentTodos) => currentTodos.filter((item) => item.key !== todo.key))
    setError('')

    const request = operation.queue.then(async () => {
      if (!operation.serverId) return

      try {
        await deleteTodo(todoList.id, operation.serverId)
      } catch (requestError) {
        operation.deleted = false
        setError(requestError.message)
        setTodos((currentTodos) =>
          currentTodos.some((item) => item.key === todo.key)
            ? currentTodos
            : [...currentTodos, todo],
        )
      }
    })
    operation.queue = request
    await request
    if (operation.deleted) {
      todoOperations.current.delete(todo.key)
      setError('')
    }
  }

  const addTodo = () => {
    setTodos((currentTodos) => [
      ...currentTodos,
      {
        key: `draft-${nextTodoKey.current++}`,
        id: null,
        text: '',
      },
    ])
  }

  const flushPendingSaves = () => {
    commitTitle()
    todos.forEach((todo) => commitTodo(todo, getTodoOperation(todo)))
  }

  const updateTodoText = (todo, text) => {
    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.key === todo.key ? { ...currentTodo, text } : currentTodo,
      ),
    )
    scheduleTodoSave(todo, text)
  }

  const updateTitle = (text) => {
    setTitle(text)
    scheduleTitleSave(text)
  }

  return {
    title,
    todos,
    savingTodoKeys,
    error,
    updateTitle,
    commitTitle,
    updateTodoText,
    commitTodoText,
    handleDeleteTodo,
    addTodo,
    flushPendingSaves,
  }
}
