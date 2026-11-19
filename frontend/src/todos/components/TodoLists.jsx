import { Fragment, useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import { createTodoList, getTodoList, getTodoLists, updateTodoList } from '../api'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [newListTitle, setNewListTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingList, setLoadingList] = useState(false)
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getTodoLists()
      .then((lists) => {
        setTodoLists(lists)
        setActiveList(Object.keys(lists)[0])
      })
      .catch((requestError) => {
        setError(requestError.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleCreateList = async (event) => {
    event.preventDefault()

    const title = newListTitle.trim()
    if (!title) {
      setError('List title must not be empty.')
      return
    }
    setError('')
    setIsCreatingList(true)

    try {
      const todoList = await createTodoList(title)
      setTodoLists((lists) => ({ ...lists, [todoList.id]: todoList }))
      setActiveList(todoList.id)
      setNewListTitle('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsCreatingList(false)
    }
  }

  const handleSelectList = async (listId) => {
    setError('')
    setLoadingList(true)
    try {
      const todoList = await getTodoList(listId)
      setTodoLists((lists) => ({ ...lists, [listId]: todoList }))
      setActiveList(listId)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingList(false)
    }
  }

  const saveTodoListTitle = async (listId, title) => {
    const updatedList = await updateTodoList(listId, { title })
    setTodoLists((lists) => ({
      ...lists,
      [listId]: { ...lists[listId], title: updatedList.title },
    }))
    return updatedList
  }

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <form onSubmit={handleCreateList}>
            <TextField
              label='New list title'
              value={newListTitle}
              onChange={(event) => setNewListTitle(event.target.value)}
              size='small'
              disabled={isCreatingList}
            />
            <CardActions>
              <Button type='submit' variant='contained' disabled={isCreatingList}>
                Create List
              </Button>
            </CardActions>
          </form>
          {error && <Alert severity='error'>{error}</Alert>}
          {loading && <Typography role='status'>Loading lists...</Typography>}
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItemButton
                key={key}
                selected={activeList === key}
                onClick={() => handleSelectList(key)}
                disabled={loadingList}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
              </ListItemButton>
            ))}
          </List>
          {!loading && !Object.keys(todoLists).length && (
            <Typography>No todo lists yet. Create one to get started.</Typography>
          )}
        </CardContent>
      </Card>
      {loadingList && <Typography role='status'>Loading list...</Typography>}
      {todoLists[activeList] && !loadingList && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoListTitle={saveTodoListTitle}
        />
      )}
    </Fragment>
  )
}
