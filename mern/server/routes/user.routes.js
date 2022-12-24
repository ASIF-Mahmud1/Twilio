const express = require('express')
const userCtrl = require('../controllers/user.controller')
const conversationCtrl = require('../controllers/conversation.controller')
const groupConversationCtrl = require('../controllers/group-conversation.controller')


const router = express.Router()

router.route('/signup')
  .post(userCtrl.signUp, conversationCtrl.create)

router.route('/signup-group-chat')
  .post(userCtrl.signUp, groupConversationCtrl.create)

module.exports = {
  userRoutes: router
}