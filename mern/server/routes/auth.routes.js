const express = require('express')
const authCtrl = require('../../server/controllers/auth.controller')
const router = express.Router()

router.route('/login')
  .post(authCtrl.signin)

router.route('/twilioToken')
  .post(authCtrl.getTwilioToken)

router.route('/liveVideoTwilioToken')
  .post(authCtrl.getLiveVideoTwilioToken)

router.route('/syncTwilioToken')
  .post(authCtrl.getSyncTwilioToken)  

router.route('/getVerificatinCode/:phoneNumber')
  .get(authCtrl.getVerficationTwilio)

router.route('/checkVerificatinCode/:phoneNumber/:otp')
  .get(authCtrl.checkVerficationTwilio)

module.exports = {
  authRoutes: router
}