const express = require('express')
const coreCtrl = require('../controllers/core.server.controller')
const router = express.Router()

router.route('/')
  .get(coreCtrl.index)

  module.exports = {
    coreRoutes: router
  }