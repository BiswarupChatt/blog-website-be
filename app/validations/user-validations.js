const User = require('../models/user-model')

const userRegisterValidation = {
    firstName: {
        in: ['body'],
        exists: {
            errorMessage: 'First Name is required'
        },
        notEmpty: {
            errorMessage: 'First Name cannot be empty'
        },
        trim: true
    },
    lastName: {
        in: ['body'],
        exists: {
            errorMessage: 'Last Name is required'
        },
        notEmpty: {
            errorMessage: 'Last Name cannot be empty'
        },
        trim: true
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'Email is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw new Error('Email Already Taken')
                } else {
                    return true
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isLength: {
            options: {
                min: 8, max: 128
            },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    }
}

const userLoginValidation = {
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'Email is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isLength: {
            options: {
                min: 8, max: 128
            },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    }
}

const userUpdateValidation = {
    firstName: {
        in: ['body'],
        exists: {
            errorMessage: 'First Name is required'
        },
        notEmpty: {
            errorMessage: 'First Name cannot be empty'
        },
        trim: true
    },
    lastName: {
        in: ['body'],
        exists: {
            errorMessage: 'Last Name is required'
        },
        notEmpty: {
            errorMessage: 'Last Name cannot be empty'
        },
        trim: true
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'Email is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isLength: {
            options: {
                min: 8, max: 128
            },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    }
}

module.exports = { userRegisterValidation, userLoginValidation, userUpdateValidation }