import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import server from './src/server.js'
const app = express()
const port = 3000

dotenv.config({ path: './config/.env', quiet: true })

app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,PATCH"
}));

server(app, express)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))