const jwt = require('jsonwebtoken')
const logger = require('../lib/logger')

function isTokenPresent (req, res, next) {
  try {
    const bearerHeader = req.headers.authorization
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      jwt.verify(bearerToken, 'secret', (err) => {
        if (err) {
          res.status(403).send({
            message: 'Forbidden..!'
          })
        } else {
          req.token = bearerToken
          next()
        }
      })
    } else {
      throw new Error('Token verification failed')
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = { isTokenPresent }
