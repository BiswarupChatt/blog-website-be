const Post = require('../models/post-model')
const { validationResult } = require('express-validator')

const postCtrl = {}

postCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const post = new Post(body)
        post.author = req.user.id
        await post.save()
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

postCtrl.findAll = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const post = await Post.find().populate('author', 'firstName lastName email')
        res.status(201).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

postCtrl.findById = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const postId = req.params.id
        const post = await Post.findById(postId).populate('author', 'firstName lastName email')
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

postCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = _.pick(req.body, ['title', 'content'])
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (post.author === req.user.id) {
            const newPost = await Post.findByIdAndUpdate(postId, body, { new: true })
            return res.status(201).json(newPost)
        } else {
            return res.status(500).json({ errors: "You're not authorized to update" })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}


module.exports = postCtrl