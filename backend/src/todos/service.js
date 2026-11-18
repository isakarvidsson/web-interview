import { randomUUID } from 'node:crypto'

const INITIAL_TODO_LISTS = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: ['First todo of first list!'],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: ['First todo of second list!'],
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

  todoList.todos.push(text)
  return todoList
}

export const updateTodo = (listId, index, text) => {
  const todoList = getTodoList(listId)
  if (!todoList || index >= todoList.todos.length) return null

  todoList.todos[index] = text
  return todoList
}

export const deleteTodo = (listId, index) => {
  const todoList = getTodoList(listId)
  if (!todoList || index >= todoList.todos.length) return false

  todoList.todos.splice(index, 1)
  return true
}
