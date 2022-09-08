const express = require("express");
const app = express();
const cors = require("cors");
const {authRoutes} =require ('../server/routes/auth.routes')
require("dotenv").config({ path: "./config.env" });
app.use(cors());
app.use(express.json());
app.use('/', authRoutes)

module.exports={
    app:app
}