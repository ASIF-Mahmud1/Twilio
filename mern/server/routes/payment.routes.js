const express = require('express')
const router = express.Router()
const paymentCtrl = require('../controllers/payment.controller')

router.route('/requestPayment')
  .post(paymentCtrl.requestPaymentURL)  

module.exports = {
  paymentRoutes: router
}