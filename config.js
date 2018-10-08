const express = require('express')
const app = express()
const server = require('http').Server(app)
var io = require('socket.io')(server)

var allowedOrigins = "https://socialblogjt.netlify.com";
var sio_server = io(server, {
    origins: allowedOrigins
})

module.exports = {express, app, server, io}