import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addTodo,
  createTodoList,
  deleteTodo,
  getTodoList,
  getTodoLists,
  updateTodo,
  updateTodoList,
} from '../../src/todos/service.js'

test('creates a list and its todos', () => {
  const todoList = createTodoList('Test List')

  assert.equal(todoList.title, 'Test List')
  assert.deepEqual(todoList.todos, [])
  assert.equal(getTodoList(todoList.id), todoList)
  assert.equal(getTodoLists()[todoList.id], todoList)

  const todo = addTodo(todoList.id, 'Test todo')
  assert.equal(todo.text, 'Test todo')
  assert.equal(todoList.todos.length, 1)
  assert.equal(todoList.todos[0].id, todo.id)
})

test('updates a list title', () => {
  const todoList = createTodoList('Before')

  updateTodoList(todoList.id, { title: 'After' })

  assert.equal(todoList.title, 'After')
})

test('updates a todo text', () => {
  const todoList = createTodoList('Test List')
  const todo = addTodo(todoList.id, 'Before text')

  updateTodo(todoList.id, todo.id, 'After text')

  assert.equal(todo.text, 'After text')
})

test('deletes a todo and handles missing resources', () => {
  const todoList = createTodoList('Delete List')
  const todo = addTodo(todoList.id, 'Delete me')

  assert.equal(deleteTodo(todoList.id, todo.id), true)
  assert.equal(todoList.todos.length, 0)
  assert.equal(deleteTodo(todoList.id, todo.id), false)
  assert.equal(getTodoList('missing-list'), undefined)
  assert.equal(updateTodoList('missing-list', { title: 'Nope' }), null)
})
