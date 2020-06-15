const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

const logger = require('../lib/logger')

async function login (req, res) {
  try {
    const { mobile, password } = req.body
    if (typeof mobile === 'undefined' && typeof password === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await User.findOne({ mobile: mobile }, async (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          if (!docs) {
            res.status(500).send({
              success: false,
              message: 'No matches'
            })
          } else {
            if (docs.activeStatus) {
              bcrypt.compare(password, docs.password, (err, isMatch) => {
                if (err) {
                  logger.error('DB Error')
                  res.status(502).send({
                    success: false,
                    message: 'DB Error'
                  })
                } else if (isMatch) {
                  jwt.sign({ docs }, 'secret', (err, token) => {
                    if (err) {
                      logger.error('DB Error')
                      res.status(500).send({
                        success: false,
                        message: 'DB Error'
                      })
                    } else {
                      logger.info('Token Generated')
                      res.status(200).send({
                        success: true,
                        id: docs._id,
                        jwttoken: token,
                        role: docs.role
                      })
                    }
                  })
                } else {
                  res.status(401).send({
                    success: false,
                    message: 'Wrong Password'
                  })
                }
              })
            } else {
              res.status(401).send({
                success: false,
                message: 'Not Active'
              })
            }
          }
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    })
  }
}

async function addUser (req, res) {
  try {
    const { name, mobile, password } = req.body
    if (typeof name === 'undefined' && typeof mobile === 'undefined') {
      logger.error('Bad Request!')
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    } else {
      await User.find({ mobile: mobile }, async (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          if (docs.length !== 0) {
            res.status(403).send({
              success: false,
              message: 'User with this Mobile Registered Already!'

            })
          } else {
            const salt = 10
            bcrypt.hash(password, salt, function (err, hash) {
              if (err) {
                logger.error('DB Error')
                res.status(502).send({
                  success: false,
                  message: 'DB Error'
                })
              } else {
                const newUser = new User({
                  name,
                  password: hash,
                  mobile
                })
                newUser.save((err, docs) => {
                  if (err) {
                    logger.error('DB Error')
                    res.status(500).send({
                      success: false,
                      message: 'DB Error'
                    })
                  } else {
                    logger.info('New User Created!')
                    res.status(200).send({
                      success: true,
                      message: 'User Created!'
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function getAllUsers (req, res) {
  try {
    await User.find({ role: { $ne: 'ADMIN' } }, (err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(502).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        logger.info('Fetched All User Details')
        res.status(200).send({
          success: true,
          message: docs
        })
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function getUserDetails (req, res) {
  try {
    const { userId } = req.params
    if (typeof userId === 'undefined') {
      logger.error('Bad Request!')
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    } else {
      await User.findById(userId, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Retrived User Details')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function deleteUser (req, res) {
  try {
    const { userId } = req.body

    if (typeof userId === 'undefined') {
      logger.error('Bad Request!')
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    } else {
      await User.deleteMany({ _id: { $in: userId } }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('User Details Has Been Deleted From Creds')
          res.status(200).send({
            success: true,
            message: 'User Deleted'
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}
async function deleteAllUsers (req, res) {
  try {
    await User.deleteMany({ role: { $ne: 'ADMIN' } }, async (err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(502).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        logger.info('All User Details Has Been Deleted')
        res.status(200).send({
          success: true,
          message: 'All Users Deleted'
        })
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function toggleActiveStatus (req, res) {
  try {
    const { userId, status } = req.params
    if (typeof userId === 'undefined' && typeof status === 'undefined') {
      logger.error('Bad Request!')
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    } else {
      await User.findByIdAndUpdate(userId, { $set: { activeStatus: status } }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Active Status Updated')
          res.status(200).send({
            success: true,
            message: 'Active Status Updated'
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function getActiveUsers (req, res) {
  try {
    await User.find({ activeStatus: true, role: { $ne: 'ADMIN' } }, (err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(502).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        logger.info('Fetched Active Users')
        res.status(200).send({
          success: true,
          message: docs
        })
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

async function updateUserRating (req, res) {
  try {
    const { userId, value } = req.params
    if (typeof userId === 'undefined' && typeof value === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await User.findByIdAndUpdate(userId, { $set: { rating: value } }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info(' User Rating Updated')
          res.status(200).send({
            success: true,
            message: 'Updated user Rating!'
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getAllUsers,
  getUserDetails,
  addUser,
  login,
  deleteAllUsers,
  deleteUser,
  toggleActiveStatus,
  getActiveUsers,
  updateUserRating
}
