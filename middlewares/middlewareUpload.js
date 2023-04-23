const multer = require('multer')

// create the middlewareImage function using multer
const middlewareImage = multer({
  // set the file size limit to 2MB
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  // set the file filter to only allow jpg, jpeg, or png files
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
// set the number of files allowed to be uploaded to 1
}).any()

// export the middleware function
module.exports = middlewareImage
