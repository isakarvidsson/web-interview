const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

const request = async (path, { method = 'GET', body } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error || `Request failed with status ${response.status}.`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const getTodoLists = () => request('/lists')

export const getTodoList = (listId) => request(`/lists/${encodeURIComponent(listId)}`)

export const createTodoList = (title) => request('/lists', { method: 'POST', body: { title } })

export const updateTodoList = (listId, updates) =>
  request(`/lists/${encodeURIComponent(listId)}`, {
    method: 'PATCH',
    body: updates,
  })

export const createTodo = (listId, text) =>
  request(`/lists/${encodeURIComponent(listId)}/todos`, {
    method: 'POST',
    body: { text },
  })

export const updateTodo = (listId, todoId, text) =>
  request(`/lists/${encodeURIComponent(listId)}/todos/${encodeURIComponent(todoId)}`, {
    method: 'PATCH',
    body: { text },
  })

export const deleteTodo = (listId, todoId) =>
  request(`/lists/${encodeURIComponent(listId)}/todos/${encodeURIComponent(todoId)}`, {
    method: 'DELETE',
  })
