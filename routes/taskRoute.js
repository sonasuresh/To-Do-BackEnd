const router = require('express').Router()
const taskController = require('../controllers/taskController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/', middleware.isTokenPresent, taskController.assignTask)
router.put('/deliverydate/:taskId/:deliveryDate', middleware.isTokenPresent, taskController.scheduleDeliveryDate)
router.put('/:taskId/:status', middleware.isTokenPresent, taskController.updateDeliveryStatus)
router.get('/:userId/today', middleware.isTokenPresent, taskController.getCurrentDayUserTasks)
router.get('/:userId/:date', middleware.isTokenPresent, taskController.getUserTasksBasedOnDate)
router.get('/:userId', middleware.isTokenPresent, taskController.getUserTasks)
router.get('/', middleware.isTokenPresent, taskController.getAllTasks)
router.delete('/:taskId', middleware.isTokenPresent, taskController.deleteTask)
router.delete('/', middleware.isTokenPresent, taskController.deleteAllTasks)

module.exports = router
