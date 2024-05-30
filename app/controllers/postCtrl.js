const Post = require('../models/post-model')
const { validationResult } = require('express-validator')
const { cloudinary } = require('../middlewares/multerConfig')

const postCtrl = {}

postCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'blog_website/post_images',
                        quality: 'auto',
                        transformation: [
                            { width: 800, crop: 'limit' }
                        ]
                    },
                    (err, result) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    }
                ).end(req.file.buffer)
            })
            body.bannerImage = result.secure_url
        }
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

postCtrl.myPosts = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const post = await Post.find({ author: req.user.id }).populate('author', 'firstName lastName email')
        return res.status(201).json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ errors: 'Something Went wrong' })
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
        const body = req.body
        const postId = req.params.id
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'blog_website/post_images',
                        quality: 'auto',
                        transformation: [
                            { width: 800, crop: 'limit' }
                        ]
                    },
                    (err, result) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    }
                ).end(req.file.buffer)
            })
            body.bannerImage = result.secure_url
        }
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ errors: "Post not found" })
        }

        if (post.author._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ errors: "You're not authorized to update" })
        }

        const updatePost = await Post.findByIdAndUpdate(postId, body, { new: true })
        return res.status(200).json(updatePost)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

postCtrl.delete = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (parseInt(post.author) === parseInt(req.user.id)) {
            await Post.findByIdAndDelete(postId)
            return res.status(200).json('Deleted Successfully')
        } else {
            return res.status(500).json({ errors: "You're not authorized to delete" })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}




module.exports = postCtrl