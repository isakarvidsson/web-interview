import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoLists } from '../TodoLists'
import { createTodoList, getTodoList, getTodoLists } from '../../api'

jest.mock('../../api', () => ({
  createTodoList: jest.fn(),
  getTodoList: jest.fn(),
  getTodoLists: jest.fn(),
  updateTodoList: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('loads and displays todo lists', async () => {
  getTodoLists.mockResolvedValue({
    'list-1': { id: 'list-1', title: 'Shopping', todos: [] },
  })

  render(<TodoLists />)

  expect((await screen.findAllByText('Shopping')).length).toBeGreaterThan(0)
})

test('creates a new todo list', async () => {
  const user = userEvent.setup()
  getTodoLists.mockResolvedValue({})
  createTodoList.mockResolvedValue({
    id: 'list-2',
    title: 'Work',
    todos: [],
  })
  getTodoList.mockResolvedValue({
    id: 'list-2',
    title: 'Work',
    todos: [],
  })

  render(<TodoLists />)

  const input = await screen.findByLabelText('New list title')
  await user.type(input, 'Work')
  await user.click(screen.getByRole('button', { name: 'Create List' }))

  expect(createTodoList).toHaveBeenCalledWith('Work')
  expect((await screen.findAllByText('Work')).length).toBeGreaterThan(0)
})
