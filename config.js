const express = require('express')
const app = express()
const server = require('http').Server(app)
var io = require('socket.io')(server, { origins: allowedOrigins})

var allowedOrigins = "https://socialblogjt.netlify.com"

module.exports = {express, app, server, io}