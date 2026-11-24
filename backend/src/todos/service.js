import { randomUUID } from 'node:crypto'

const INITIAL_TODO_LISTS = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: [{ id: randomUUID(), text: 'First todo of first list!' }],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: [{ id: randomUUID(), text: 'First todo of second list!' }],
  },
}

const todoLists = INITIAL_TODO_LISTS

export const getTodoLists = () => todoLists

export const getTodoList = (id) => todoLists[id]

export const createTodoList = (title) => {
  const id = randomUUID()
  const todoList = { id, title, todos: [] }
  todoLists[id] = todoList
  return todoList
}

export const updateTodoList = (id, updates) => {
  const todoList = getTodoList(id)
  if (!todoList) return null

  Object.assign(todoList, updates)
  return todoList
}

export const addTodo = (listId, text) => {
  const todoList = getTodoList(listId)
  if (!todoList) return null

  const todo = { id: randomUUID(), text }
  todoList.todos.push(todo)
  return todo
}

export const updateTodo = (listId, todoId, text) => {
  const todoList = getTodoList(listId)
  const todo = todoList?.todos.find((item) => item.id === todoId)
  if (!todo) return null

  todo.text = text
  return todo
}

export const deleteTodo = (listId, todoId) => {
  const todoList = getTodoList(listId)
  if (!todoList) return false

  const todoIndex = todoList.todos.findIndex((todo) => todo.id === todoId)
  if (todoIndex === -1) return false

  todoList.todos.splice(todoIndex, 1)
  return true
}
