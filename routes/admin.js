const express = require('express')
const router = express.Router()


// Controller
const adminController = require('../controllers/adminCtrl')

router.get('/login', adminController.showLoginPage)
// router.post('/login', adminController.postLogin)

router.get('/', adminController.index)

module.exports = router;

