const express = require('express')
const conversationCtrl = require('../controllers/conversation.controller')

const router = express.Router()

router.route('/list')
  .get(conversationCtrl.list)


module.exports = {
  conversationRoutes: router
}