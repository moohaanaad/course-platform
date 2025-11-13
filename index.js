import express from 'express'
import server from './src/server.js'
import dotenv from 'dotenv'
const app = express()
const port = 3000

dotenv.config({ path: './config/.env', quiet: true })

server(app, express)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))