const express = require('express')
const app = express()
const server = require('http').Server(app)
var io = require('socket.io')({path: '/blogserver', server})

module.exports = {express, app, server, io}
