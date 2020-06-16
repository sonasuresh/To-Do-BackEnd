const Task = require('../models/taskModel')
const logger = require('../lib/logger')

async function assignTask (req, res) {
  try {
    const { assignedTo, description, dueDate } = req.body
    if (typeof assignedTo === 'undefined' && typeof description === 'undefined' && typeof dueDate === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      const newTask = new Task({
        assignedTo,
        description,
        dueDate
      })
      newTask.save((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('New Task Created and assigned!')
          res.status(200).send({
            success: true,
            message: 'New Task Created and assigned!'
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

async function getAllTasks (req, res) {
  try {
    await Task.aggregate([
      { $addFields: { assignedTo: { $toObjectId: '$assignedTo' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]).exec((err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(502).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        logger.info('Retrived All Tasks')
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

async function getUserTasks (req, res) {
  try {
    const { userId } = req.params
    console.log(userId)
    if (typeof userId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await Task.find({ assignedTo: userId }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Retrived Individuals Tasks')
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

async function updateDeliveryStatus (req, res) {
  try {
    const { taskId, status } = req.params
    if (typeof taskId === 'undefined' && typeof status === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      var updateFields
      if (status === 'true') {
        updateFields = { deliveryStatus: status }
      } else {
        const today = new Date()
        var tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow = tomorrow.toString('YYYY-MM-dd').slice(0, -47)
        console.log(tomorrow)
        updateFields = { deliveryStatus: status, deliveryDate: tomorrow }
      }

      await Task.findOneAndUpdate({ _id: taskId }, { $set: updateFields }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Delivery Status Updated')
          res.status(200).send({
            success: true,
            message: 'Delivery Status Updated'
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
async function deleteAllTasks (req, res) {
  try {
    await Task.deleteMany({}, (err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(502).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        logger.info('All Task Details Deleted!')
        res.status(200).send({
          success: true,
          message: 'All Tasks Deleted'
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

async function deleteTask (req, res) {
  try {
    const { taskId } = req.params
    if (typeof taskId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await Task.findByIdAndDelete(taskId, async (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Task Details Deleted!')
          res.status(200).send({
            success: true,
            message: 'Task Deleted'
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

async function scheduleDeliveryDate (req, res) {
  try {
    const { taskId, deliveryDate } = req.params
    if (typeof taskId === 'undefined' && typeof deliveryDate === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await Task.findByIdAndUpdate(taskId, { $set: { deliveryDate } }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Delivery Date Scheduled')
          res.status(200).send({
            success: true,
            message: 'Delivery Date Scheduled'
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

async function getCurrentDayUserTasks (req, res) {
  try {
    console.log('here')

    const { userId } = req.params
    if (typeof userId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      const today = new Date().toString('YYYY-MM-dd').slice(0, -40)
      console.log(today)
      await Task.aggregate([
        { $addFields: { userId: { $toObjectId: '$userId' } } },
        {

          $match: {
            deliveryDate: today,
            assignedTo: userId
          }
        }
      ].exec((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Retrived Individuals Current Day Tasks')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      }))
      // await Task.find({ assignedTo: { $toObjectId: userId }, deliveryDate: today }, (err, docs) => {
      //   if (err) {
      //     logger.error('DB Error')
      //     res.status(502).send({
      //       success: false,
      //       message: 'DB Error'
      //     })
      //   } else {
      //     logger.info('Retrived Individuals Current Day Tasks')
      //     res.status(200).send({
      //       success: true,
      //       message: docs
      //     })
      //   }
      // })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
}
async function getUserTasksBasedOnDate (req, res) {
  try {
    const { userId, date } = req.params
    if (typeof userId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await Task.find({ assignedTo: userId, deliveryDate: date }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Retrived Individuals Tasks Based On Date')
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

module.exports = {
  assignTask,
  getAllTasks,
  getUserTasks,
  deleteTask,
  deleteAllTasks,
  scheduleDeliveryDate,
  updateDeliveryStatus,
  getCurrentDayUserTasks,
  getUserTasksBasedOnDate
}
