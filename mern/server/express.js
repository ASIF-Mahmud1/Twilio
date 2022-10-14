const express = require("express");
const app = express();
const cors = require("cors");
const {authRoutes} =require ('../server/routes/auth.routes')
const {userRoutes} =require ('../server/routes/user.routes')
const {conversationRoutes} =require ('../server/routes/conversation.routes')
const {videoRoutes} = require('../server/routes/video.routes')
const {coreRoutes} =  require('../server/routes/core.server.routes')
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

// add routes
app.use('/auth', coreRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/conversation', conversationRoutes)
app.use('/video', videoRoutes)

module.exports={
    app:app
}