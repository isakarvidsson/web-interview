import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItemRow } from '../TodoItemRow'

test('renders a todo and handles editing and deletion', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  const onDelete = jest.fn()

  render(
    <TodoItemRow
      todo={{ key: 'todo-1', id: 'todo-1', text: 'Buy milk' }}
      index={0}
      isSaving={false}
      onChange={onChange}
      onBlur={jest.fn()}
      onDelete={onDelete}
    />,
  )

  const input = screen.getByLabelText('What to do?')
  expect(input).toHaveValue('Buy milk')

  fireEvent.change(input, { target: { value: 'Buy bread' } })
  expect(onChange).toHaveBeenLastCalledWith('Buy bread')

  await user.click(screen.getByRole('button', { name: 'Delete todo 1' }))
  expect(onDelete).toHaveBeenCalled()
})
