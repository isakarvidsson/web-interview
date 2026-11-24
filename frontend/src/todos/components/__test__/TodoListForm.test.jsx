import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { TodoListForm } from '../TodoListForm'

test('renders the list title and todo fields', () => {
  render(
    <TodoListForm
      todoList={{
        id: 'list-1',
        title: 'Shopping',
        todos: [{ id: 'todo-1', text: 'Buy milk' }],
      }}
      saveTodoListTitle={jest.fn()}
    />,
  )

  expect(screen.getByLabelText('List title')).toHaveValue('Shopping')
  expect(screen.getByLabelText('What to do?')).toHaveValue('Buy milk')
  expect(screen.getByRole('button', { name: /Add Todo/i })).toBeInTheDocument()
})
