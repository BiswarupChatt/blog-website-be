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
                min: 10
            },
            errorMessage: 'Content Should be minimum 100 characters long'
        },
        trim: true
    },
}

module.exports = {postValidation}