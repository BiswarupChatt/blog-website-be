const Comment = require('../models/comment-model')
const { validationResult } = require('express-validator')

commentCtrl = {}

commentCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const comment = new Comment(body)
        comment.author = req.user.id
        comment.post = req.params.postId
        await comment.save()
        res.status(201).json(comment)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

commentCtrl.find = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const post = req.params.postId
        const comment = await Comment.find({ post: post }).populate('author', 'firstName lastName email').populate('post', 'title')
        res.status(201).json(comment)
    } catch (err) {
        res.status(400).json({ errors: 'Something went wrong' })
    }
}

commentCtrl.findById = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const commentId = req.params.commentId
        const comment = await Comment.findById(commentId).populate('author', 'firstName lastName email').populate('post', 'title')
        res.status(201).json(comment)
    } catch (err) {
        res.status(400).json({ errors: 'Something went wrong' })
    }
}


commentCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const commentId = req.params.commentId
        const comment = await Comment.findById(commentId)
        if (parseInt(comment.author) === parseInt(req.user.id)) {
            const updatedComment = await Comment.findByIdAndUpdate(commentId, body, { new: true })
            res.status(201).json(updatedComment)
        } else {
            res.status(400).json({ errors: "You're not authorized to update comment" })
        }
    } catch (err) {
        res.status(400).json({ errors: 'Something went wrong' })
    }
}

commentCtrl.delete = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const commentId = req.params.commentId
        const comment = await Comment.findById(commentId)
        if (parseInt(comment.author) === parseInt(req.user.id)) {
            const deletedComment = await Comment.findByIdAndDelete(commentId)
            res.status(201).json(deletedComment)
        } else {
            res.status(400).json({ errors: "You're not authorized to delete comment" })
        }
    } catch (err) {
        res.status(400).json({ errors: 'Something went wrong' })
    }
}

module.exports = commentCtrl