require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { checkSchema, check } = require('express-validator')

const configureDB = require('./config/db')

const userCtrl = require('./app/controllers/user-ctrl')
const postCtrl = require('./app/controllers/postCtrl')

const { userRegisterValidation, userLoginValidation, userUpdateValidation } = require('./app/validations/user-validations')
const {postValidation} = require('./app/validations/post-validations')

const { upload } = require('./app/middlewares/multerConfig')
const authenticateUser = require('./app/middlewares/authenticateUser')

const app = express()
const port = process.env.PORT

configureDB()

app.use(express.json())
app.use(morgan('common'))
app.use(cors())

app.post('/api/users/register', checkSchema(userRegisterValidation), userCtrl.register)
app.post('/api/users/login', checkSchema(userLoginValidation), userCtrl.login)
app.get('/api/users/profile', authenticateUser, userCtrl.account)
app.put('/api/users/profile', authenticateUser, checkSchema(userUpdateValidation), userCtrl.update)
app.put('/api/users/profile/imageUpdate', authenticateUser, upload.single('profileImage'), userCtrl.profileImageUpdate)

app.post('/api/posts', authenticateUser, checkSchema(postValidation), postCtrl.create)
app.get('/api/posts',  postCtrl.findAll)
app.get('/api/posts/:id',  postCtrl.findById)
app.get('/api/posts/:id', authenticateUser, checkSchema(postValidation),  postCtrl.update)


app.listen(port, () => {
    console.log(`server is running successfully on this url http://localhost:${port}`)
})