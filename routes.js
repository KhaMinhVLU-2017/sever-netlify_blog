process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const postController = require('./api/controller/postController')
const loginCon = require('./api/controller/loginController')
const express = require('express')
const router = express.Router()
// var jwt = require('jsonwebtoken')
// Get Multer Images
var multer = require('multer')
var fs = require('fs')
// var path = require('path')
var FroalaEditor = require('./node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js')
// Import file Config Socket
var config = require('./config')
// Get Parame from client
var bodyParser = require('body-parser')
router.use(bodyParser.json()) // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    // console.log(file)
    let fileExtension = file.originalname.split('.')[1]
    cb(null, Date.now() + '.' + fileExtension)
  }
})
var upload = multer({ storage: storage })

/**
 * Article
 */
router.post('/crArticle', loginCon.verifyToken, upload.single('image'), async (req, res) => {
  try {
    // const decode = jwt.verify(req.token, 'PesiSecretKey') // Decode from Token in verifyToken
    let title = req.body.title
    let author = req.body.author
    let category = req.body.category
    let sapo = req.body.sapo
    let content = req.body.content
    let image = '/images/' + req.file.filename
    let imageEditor = req.body.imageEditor
    let lynSta = await postController.crArticle(title, sapo, content, author, image, imageEditor, category) // write Post inside
    // console.log(lynSta)
    if (lynSta.status === 200) {
      config.io.emit('refesh', {data: true, message: 'upgrade'})
      res.json({ status: 200 })
    }
  } catch (e) {
    res.json({ status: 403, token: 'Not definded', message: 'Create Article Faile' })
  }
})
router.get('/Articles', (req, res) => {
  // let listArti =
  postController.listArticle().then(listArti => {
    res.json({
      message: 'Complete',
      status: 200,
      listArti
    })
  })
})
// get Detail Article
router.get('/Article/:id', async (req, res) => {
  let id = req.params.id
  let detailArt = await postController.detailAricle(id)
  res.json({
    status: 200,
    message: 'Complete',
    detailArt
  })
})
// upload Image from Rich text
router.post('/Article/uploadImg', (req, res) => {
  var options = {
    validation: {
      'allowedExts': ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'],
      'allowedMimeTypes': ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
    },
    imageUploadParam: 'imgEdtor'
  }
  // Store image.
  FroalaEditor.Image.upload(req, '/public/uploaded/images/', options, function (err, data) {
    // Return data.
    let link = data.link.toString().substring(7)
    if (err) {
      console.log(err)
      return res.send(JSON.stringify(err))
    }
    // console.log(link)
    res.send(link)
  })
})
// Remove Image from Rich text
router.post('/Article/remove/:id', (req, res) => {
  let idIMG = req.params.id
  console.log(idIMG)
  let pathOld = __dirname + '/public/uploaded/images/' + idIMG
  fs.unlink(pathOld, (err) => {
    if (err) throw err
    res.json({
      status: 200,
      message: 'Delete complete Image'
    })
  })
})
/**
 * Categorys
 */
router.post('/crCaterogy', (req, res) => {
  postController.crCaterogy()
})
router.get('/categorys', async (req, res) => {
  let listCategorys = await postController.Categorys()
  // console.log(listCategorys)
  res.json({
    message: 200,
    listCategorys
  })
})
/**
 * Login, SignUp
 */
router.post('/login', async (req, res) => {
  let { email, pass } = req.body
  let token = await loginCon.login(email, pass)
  console.log(token.message)
  res.json({ token })
})
router.post('/signup', async (req, res) => {
  let {username, email, pass, passconfirm, avatar} = req.body
  let sign = await loginCon.signup(username, email, pass, passconfirm, avatar)
  console.log(sign)
  res.json(sign)
})
router.get('/getname/:id', async (req, res) => {
  let id = req.params.id
  // console.log(id)
  let name = await loginCon.getName(id)
  res.json(name)
})
router.get('/listuser', async (req, res) => {
  let listUser = await postController.getListUser()
  res.json(listUser)
})
// Remove Article and Images || Editor
router.post('/rmArticle', loginCon.verifyToken, async (req, res) => {
  let id = req.body.id
  let rmArt = await postController.removePostAriticle(id, res)
  config.io.emit('refesh', {data: true, message: 'upgrade'})
  console.log(rmArt)
  res.json(rmArt)
})

module.exports = router
