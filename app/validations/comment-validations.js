const commentValidations = {
    content: {
        in: ['body'],
        exists: {
            errorMessage: 'Content is required'
        },
        notEmpty: {
            errorMessage: 'Content cannot be empty'
        },
        trim: true
    },
    // author: {
    //     in: ['headers'],
    //     exists: {
    //         errorMessage: 'Author is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'Author cannot be empty'
    //     }
    // },
    // post: {
    //     in: ['params'],
    //     exists: {
    //         errorMessage: 'Post is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'Post cannot be empty'
    //     }
    // }
};

module.exports = {commentValidations}