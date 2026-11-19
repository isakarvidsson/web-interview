import React from 'react'
import { Alert, Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { TodoItemRow } from './TodoItemRow'
import { useTodoListEditor } from '../useTodoListEditor'

export const TodoListForm = ({ todoList, saveTodoListTitle }) => {
  const {
    title,
    todos,
    savingTodoKeys,
    error,
    updateTitle,
    commitTitle,
    updateTodoText,
    commitTodoText,
    handleDeleteTodo,
    addTodo,
    flushPendingSaves,
  } = useTodoListEditor(todoList, saveTodoListTitle)

  const handleSubmit = (event) => {
    event.preventDefault()
    flushPendingSaves()
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
            onChange={(event) => updateTitle(event.target.value)}
            onBlur={commitTitle}
          />
          {todos.map((todo, index) => (
            <TodoItemRow
              key={todo.key}
              todo={todo}
              index={index}
              isSaving={savingTodoKeys.has(todo.key)}
              onChange={(text) => updateTodoText(todo, text)}
              onBlur={() => commitTodoText(todo)}
              onDelete={() => handleDeleteTodo(todo)}
            />
          ))}
          <CardActions>
            <Button type='button' color='primary' onClick={addTodo}>
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
        {error && <Alert severity='error'>{error}</Alert>}
      </CardContent>
    </Card>
  )
}
