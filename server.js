require('./config/config')
 
const _ = require('lodash')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser') 
 
const {mongoose} = require('./db/mongoose')   // 6
const {Post} = require('./models/post')   // 7
 
const app = express()   // 8
app.use(cors())
const port = process.env.PORT || 3000  // 9

const { registerEvent } = require('./controllers/event')
const { registerPost } = require('./controllers/post')
const { registerUser } = require('./controllers/user')

app.use(bodyParser.json())
app.use(function(req, res, next) {
  next();
});

 
registerPost(app);
registerEvent(app);
registerUser(app);
 
// Listens for connection on the given port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})
 
// Exports the module as app.
module.exports = {app}
