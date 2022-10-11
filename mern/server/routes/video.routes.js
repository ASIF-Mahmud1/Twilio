const express = require('express')
const videoCtrl = require('../controllers/video.controller')

const router = express.Router()

router.route('/list')
  .get(videoCtrl.list)

module.exports = {
    videoRoutes: router
  }