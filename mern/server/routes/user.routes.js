const express = require('express')
const userCtrl = require('../controllers/user.controller')
const conversationCtrl = require('../controllers/conversation.controller')

const router = express.Router()

router.route('/signup')
  .post(userCtrl.signUp, conversationCtrl.create)


module.exports = {
  userRoutes: router
}