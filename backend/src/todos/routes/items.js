import { Router } from 'express'
import {
  addTodo,
  deleteTodo,
  getTodoList,
  updateTodo,
} from '../service.js'

const router = Router({ mergeParams: true })

const isValidTodoId = (id) => typeof id === 'string' && Boolean(id)

router.post('/', (req, res) => {
  const text = req.body?.text
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Todo text must be a non-empty string.' })
  }

  const todo = addTodo(req.params.listId, text.trim())
  if (!todo) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  res.status(201).json(todo)
})

router.patch('/:todoId', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  const todoId = req.params.todoId
  if (!isValidTodoId(todoId)) {
    return res.status(400).json({ error: 'Todo ID must not be empty.' })
  }

  const { text } = req.body ?? {}
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Todo text must be a string.' })
  }

  const updatedTodo = updateTodo(req.params.listId, todoId, text)
  if (!updatedTodo) {
    return res.status(404).json({ error: 'Todo not found.' })
  }

  res.json(updatedTodo)
})

router.delete('/:todoId', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  const todoId = req.params.todoId
  if (!isValidTodoId(todoId)) {
    return res.status(400).json({ error: 'Todo ID must not be empty.' })
  }

  if (!deleteTodo(req.params.listId, todoId)) {
    return res.status(404).json({ error: 'Todo not found.' })
  }

  res.status(204).send()
})

export default router
