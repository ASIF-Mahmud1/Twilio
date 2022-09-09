const express = require('express')
const authCtrl = require('../../server/controllers/auth.controller')
const router = express.Router()

router.route('/login')
  .post(authCtrl.signin)

router.route('/twilioToken')
  .post(authCtrl.getTwilioToken)

module.exports = {
  authRoutes: router
}