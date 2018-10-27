var config = require('./config')
var cors = require('cors')
const router = require('./routes') // Get Router from file router
// /**
//  * HTTPS
//  */
// const https = require('https')
// const fs = require('fs')

// const options = {
//   key: fs.readFileSync('meo-key.pem'),
//   cert: fs.readFileSync('key-cert.pem')
// }
config.app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  next()
})
config.app.use(cors())
/**
 * Confirm Path into public for get Images
 */
config.app.use(config.express.static('public'))
config.app.use('/api', router) // set follow Router

config.app.use('/', (req, res) => {
	res.send('Welcome to API ReactBlog')
})

var mongoose = require('mongoose')
mongoose.connect('mongodb://judasfate:blogdhs2018@ds121118.mlab.com:21118/reactblog', { useNewUrlParser: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connect Mongodb Complete')
})
// setup server listen with socket
var ip = process.env.IP || '127.0.0.1'
config.server.listen(process.env.PORT || 8888, ip, () => console.log('Server listening on !'))

/**
 * Socket Listento
 */
config.io.on('connection', (socket) => {
  console.log('a connection to sever is: ' + socket.handshake.address )
  socket.on('disconnect', function () {
    console.log('user disconnected')
  });
})
