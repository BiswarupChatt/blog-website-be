const mongoose = require('mongoose')
const { Schema, model } = mongoose

const postSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bannerImage: String
}, { timestamps: true   })

const Post = model('Post', postSchema)

module.exports = Post