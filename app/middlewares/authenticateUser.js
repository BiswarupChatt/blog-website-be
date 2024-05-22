const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(400).json({ errors: 'Token is Required' })
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: tokenData.id
        }
        next()
    } catch (err) {
        return res.status(400).json({errors: err})
    }
}

module.exports = authenticateUser