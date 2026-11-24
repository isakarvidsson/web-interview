import React from 'react'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export const TodoItemRow = ({
  todo,
  index,
  isSaving,
  onChange,
  onBlur,
  onDelete,
}) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{ margin: '8px' }} variant='h6'>
      {index + 1}
    </Typography>
    <TextField
      sx={{ flexGrow: 1, marginTop: '1rem' }}
      label='What to do?'
      value={todo.text}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
    <Button
      type='button'
      sx={{ margin: '8px' }}
      size='small'
      color='secondary'
      aria-label={`Delete todo ${index + 1}`}
      disabled={isSaving}
      onClick={onDelete}
    >
      {isSaving ? (
        <CircularProgress size={20} aria-label={`Saving todo ${index + 1}`} />
      ) : (
        <DeleteIcon />
      )}
    </Button>
  </div>
)
