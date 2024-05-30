const postValidation = {
    title: {
        in: ['body'],
        exists: {
            errorMessage: 'Title is required'
        },
        notEmpty: {
            errorMessage: 'Title cannot be empty'
        },
        trim: true
    },
    content: {
        in: ['body'],
        exists: {
            errorMessage: 'Content is required'
        },
        notEmpty: {
            errorMessage: 'Content cannot be empty'
        },
        isLength: {
            options: {
                min: 200
            },
            errorMessage: 'Content Should be minimum 200 characters long'
        },
        trim: true
    },
}

module.exports = {postValidation}