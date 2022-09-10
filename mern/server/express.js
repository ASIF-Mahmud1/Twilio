const express = require("express");
const app = express();
const cors = require("cors");
const {authRoutes} =require ('../server/routes/auth.routes')
const {userRoutes} =require ('../server/routes/user.routes')
const {conversationRoutes} =require ('../server/routes/conversation.routes')
app.use(cors());
app.use(express.json());
// add routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/conversation', conversationRoutes)

module.exports={
    app:app
}