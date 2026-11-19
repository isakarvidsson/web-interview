import React, { useEffect, useRef, useState } from 'react'
import { Alert, TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const createTodoDrafts = (todos) =>
  todos.map((text, originalIndex) => ({
    key: `existing-${originalIndex}`,
    originalIndex,
    text,
  }))

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [title, setTitle] = useState(todoList.title)
  const [todos, setTodos] = useState(() => createTodoDrafts(todoList.todos))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const nextTodoKey = useRef(todoList.todos.length)

  useEffect(() => {
    setTitle(todoList.title)
    setTodos(createTodoDrafts(todoList.todos))
    nextTodoKey.current = todoList.todos.length
  }, [todoList])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (todos.some((todo) => todo.originalIndex === null && !todo.text.trim())) {
      setError('New todos must not be empty.')
      return
    }

    setError('')
    setIsSaving(true)
    try {
      const updatedList = await saveTodoList(todoList.id, {
        title: title.trim(),
        todos,
      })
      setTitle(updatedList.title)
      setTodos(createTodoDrafts(updatedList.todos))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const addTodo = () => {
    setTodos([
      ...todos,
      {
        key: `new-${nextTodoKey.current++}`,
        originalIndex: null,
        text: '',
      },
    ])
  }

  const deleteTodo = (index) => {
    setTodos([...todos.slice(0, index), ...todos.slice(index + 1)])
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          <TextField
            sx={{ marginTop: '1rem' }}
            label='List title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSaving}
          />
          {todos.map((name, index) => (
            <div key={name.key} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={name.text}
                disabled={isSaving}
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    { ...name, text: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                aria-label={`Delete todo ${index + 1}`}
                disabled={isSaving}
                onClick={() => {
                  deleteTodo(index)
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              disabled={isSaving}
              onClick={() => {
                addTodo()
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary' disabled={isSaving}>
              Save
            </Button>
          </CardActions>
        </form>
        {error && <Alert severity='error'>{error}</Alert>}
      </CardContent>
    </Card>
  )
}
