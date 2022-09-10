const express = require('express')
const conversationCtrl = require('../controllers/conversation.controller')

const router = express.Router()

router.route('/list')
  .get(conversationCtrl.list)

router.route('/addParticipant')
  .post(conversationCtrl.addParticipant)  

router.route('/listParticipant/:sid')
  .get(conversationCtrl.listParticipantByConversationID)    

module.exports = {
  conversationRoutes: router
}