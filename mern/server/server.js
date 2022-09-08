
const mongoose  =require ('mongoose')

const {app}  =require ('./express')


mongoose.Promise = global.Promise
const port = process.env.PORT || 5000;
// Connection URL
mongoose.connect(process.env.ATLAS_URI)
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})
// get driver connection

app.listen(port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', port)
});