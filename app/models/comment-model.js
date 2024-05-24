const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true })

const Comment = model('Comment', commentSchema)

module.exports = Comment