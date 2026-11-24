import express from 'express'
import cors from 'cors'
import todoListsRouter from './todos/routes/lists.js'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/lists', todoListsRouter)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
