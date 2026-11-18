import { Router } from 'express'
import {
  addTodo,
  deleteTodo,
  getTodoList,
  updateTodo,
} from '../service.js'

const router = Router({ mergeParams: true })

const isValidTodoIndex = (index) => Number.isSafeInteger(index) && index >= 0

router.post('/', (req, res) => {
  const text = req.body?.text
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Todo text must be a non-empty string.' })
  }

  const todoList = addTodo(req.params.listId, text.trim())
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  res.status(201).json(todoList)
})

router.patch('/:todoIndex', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  const todoIndex = Number(req.params.todoIndex)
  if (!isValidTodoIndex(todoIndex)) {
    return res.status(400).json({ error: 'Todo index must be a non-negative integer.' })
  }

  const { text } = req.body ?? {}
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Todo text must be a string.' })
  }

  const updatedTodoList = updateTodo(req.params.listId, todoIndex, text)
  if (!updatedTodoList) {
    return res.status(404).json({ error: 'Todo not found.' })
  }

  res.json(updatedTodoList)
})

router.delete('/:todoIndex', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  const todoIndex = Number(req.params.todoIndex)
  if (!isValidTodoIndex(todoIndex)) {
    return res.status(400).json({ error: 'Todo index must be a non-negative integer.' })
  }

  if (!deleteTodo(req.params.listId, todoIndex)) {
    return res.status(404).json({ error: 'Todo not found.' })
  }

  res.status(204).send()
})

export default router
