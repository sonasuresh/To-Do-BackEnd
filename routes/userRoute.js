const router = require('express').Router()
const userController = require('../controllers/userController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/login', userController.login)
router.post('/', userController.addUser)
router.put('/rating/:userId/:value', middleware.isTokenPresent, userController.updateUserRating)
router.put('/:userId/:status', middleware.isTokenPresent, userController.toggleActiveStatus)
router.get('/active', middleware.isTokenPresent, userController.getActiveUsers)
router.get('/', middleware.isTokenPresent, userController.getAllUsers)
router.get('/:userId', middleware.isTokenPresent, userController.getUserDetails)
router.delete('/all', middleware.isTokenPresent, userController.deleteAllUsers)
router.delete('/', middleware.isTokenPresent, userController.deleteUser)

module.exports = router
