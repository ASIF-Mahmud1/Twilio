const express = require('express')
const groupConversationCtrl = require('../controllers/group-conversation.controller')
const router = express.Router()

router.route('/list')
  .get(groupConversationCtrl.list)

router.route('/create')
  .post(groupConversationCtrl.create)

router.route('/addParticipant')
  .post(groupConversationCtrl.addParticipant)  

router.route('/listParticipant/:sid')
  .get(groupConversationCtrl.listParticipantByConversationID)    

module.exports = {
  groupConversationRoutes: router
}