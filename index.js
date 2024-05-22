require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { checkSchema } = require('express-validator')

const configureDB = require('./config/db')

const userCtrl = require('./app/controllers/user-ctrl')

const { userRegisterValidation } = require('./app/validations/user-validations')

const { upload } = require('./app/middlewares/multerConfig')

const app = express()
const port = process.env.PORT

configureDB()

app.use(express.json())
app.use(morgan('common'))
app.use(cors())

app.post('/api/users/register', upload.single('profileImage'), checkSchema(userRegisterValidation), userCtrl.register)

app.listen(port, () => {
    console.log(`server is running successfully on this url http://localhost:${port}`)
})