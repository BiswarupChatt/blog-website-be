const multer = require('multer')
const { storage } = require('./cloudinaryConfig')

const uploads = multer({ storage: storage })

module.exports= uploads