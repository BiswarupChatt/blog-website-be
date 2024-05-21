require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const configureDB = require('./config/db')

const app = express()
const port = process.env.PORT

configureDB()

app.use(express.json())
app.use(morgan('common'))
app.use(cors())


app.listen(port, ()=>{
    console.log(`server is running successfully on this url http://localhost:${port}`)
})