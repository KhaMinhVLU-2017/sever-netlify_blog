process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const express = require('express')
const app = express()
const server = require('http').Server(app)
var io = require('socket.io')(server, { origins: allowedOrigins})

var allowedOrigins = "https://socialblogjt.netlify.com/* https://socialblogjt.netlify.com"

module.exports = {express, app, server, io}