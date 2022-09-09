
const mongoose = require('mongoose')
const { app } = require('./express')
require("dotenv").config({ path: "./config.env" });
// console.log(process.env) //
mongoose.Promise = global.Promise
const port = process.env.PORT || 5000;
// Connection URL
mongoose.connect(process.env.ATLAS_URI, {
  //   these are options to ensure that the connection is done properly
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${process.env.ATLAS_URI}`)
})
// get driver connection

app.listen(port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', port)
});
