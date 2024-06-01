require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { checkSchema } = require('express-validator')

const configureDB = require('./config/db')

const userCtrl = require('./app/controllers/user-ctrl')
const postCtrl = require('./app/controllers/postCtrl')
const commentCtrl = require('./app/controllers/commentCtrl')

const { userRegisterValidation, userLoginValidation, userUpdateValidation } = require('./app/validations/user-validations')
const { postValidation } = require('./app/validations/post-validations')
const { commentValidations } = require('./app/validations/comment-validations')

const { upload } = require('./app/middlewares/multerConfig')
const authenticateUser = require('./app/middlewares/authenticateUser')

const app = express()
const port = process.env.PORT


configureDB()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())


app.post('/api/users/register', userCtrl.register)
app.post('/api/users/login', checkSchema(userLoginValidation), userCtrl.login)
app.get('/api/users/profile', authenticateUser, userCtrl.account)
app.put('/api/users/profile', authenticateUser, checkSchema(userUpdateValidation), userCtrl.update)
app.put('/api/users/profile/imageUpdate', authenticateUser, upload.single('profileImage'), userCtrl.profileImageUpdate)

app.post('/api/posts', authenticateUser, upload.single('bannerImage'), checkSchema(postValidation), postCtrl.create)
app.get('/api/posts', postCtrl.findAll)
app.get('/api/posts/my-posts', authenticateUser, postCtrl.myPosts)
app.get('/api/posts/:id', postCtrl.findById)
app.put('/api/posts/:id', authenticateUser, upload.single('bannerImage'), checkSchema(postValidation), postCtrl.update)
app.delete('/api/posts/:id', authenticateUser, postCtrl.delete)

app.post('/api/posts/:postId/comments', authenticateUser, checkSchema(commentValidations), commentCtrl.create)
app.get('/api/posts/:postId/comments', commentCtrl.find)
app.get('/api/posts/:postId/comments/:commentId', commentCtrl.findById)
app.put('/api/posts/:postId/comments/:commentId', authenticateUser, checkSchema(commentValidations), commentCtrl.update)
app.delete('/api/posts/:postId/comments/:commentId', authenticateUser, commentCtrl.delete)
 
app.listen(port, () => {
    console.log(`server is running successfully on this url http://localhost:${port}`)
})