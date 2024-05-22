const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { welcomeEmail } = require('../utility/nodemailer')
const { cloudinary } = require('../middlewares/multerConfig')
const _ = require('lodash')

const userCtrl = {}

userCtrl.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User({ ...body, password: hashPassword })

        await user.save()
        
        const newUser = await User.findOne({ email: req.body.email })
        if (newUser) {
            welcomeEmail(newUser.email, newUser.firstName)
        } else {
            return res.status(400).json({ errors: 'New user not found' })
        }
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if (isAuth) {
                const tokenData = {
                    id: user._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
                return res.status(200).json({ token })
            } else {
                return res.status(500).json({ errors: 'Invalid credentials' })
            }
        } else {
            return res.status(500).json({ errors: 'Invalid credentials' })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.account = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        return res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = _.pick(req.body, ['firstName', 'lastName', 'email'])
        console.log(body)

        const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
        return res.status(201).json(_.pick(user, ['_id', 'firstName', 'lastName', 'email']))
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.profileImageUpdate = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = _.pick(req.body, ['_id', 'profileImage'])

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'user_profiles' },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                        }
                    }
                ).end(req.file.buffer)
            })
            body.profileImage = result.secure_url
            console.log('image uploaded to cloudinary')

            const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
            return res.status(201).json(_.pick(user, ['_id', 'profileImage']))
        }

    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}
module.exports = userCtrl