import { Router } from 'express'
import {
  createTodoList,
  getTodoList,
  getTodoLists,
  updateTodoList,
} from '../service.js'
import todoItemsRouter from './items.js'

const router = Router()

const isValidListTitle = (title) => typeof title === 'string' && Boolean(title.trim())

router.get('/', (req, res) => res.json(getTodoLists()))

router.post('/', (req, res) => {
  const title = req.body?.title
  if (!isValidListTitle(title)) {
    return res.status(400).json({ error: 'List title must be a non-empty string.' })
  }

  res.status(201).json(createTodoList(title.trim()))
})

router.use('/:listId/todos', todoItemsRouter)

router.get('/:listId', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  res.json(todoList)
})

router.patch('/:listId', (req, res) => {
  const todoList = getTodoList(req.params.listId)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found.' })
  }

  const body = req.body ?? {}
  const updates = {}
  if (Object.hasOwn(body, 'title')) {
    if (!isValidListTitle(body.title)) {
      return res.status(400).json({ error: 'List title must be a non-empty string.' })
    }
    updates.title = body.title.trim()
  }
  if (Object.hasOwn(body, 'todos')) {
    if (!Array.isArray(body.todos) || body.todos.some((todo) => typeof todo !== 'string')) {
      return res.status(400).json({ error: 'Todos must be an array of strings.' })
    }
    updates.todos = body.todos
  }
  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Provide a list title or todos to update.' })
  }

  res.json(updateTodoList(req.params.listId, updates))
})

export default router
