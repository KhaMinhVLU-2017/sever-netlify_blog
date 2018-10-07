const User = require('../model/user')

var jwt = require('jsonwebtoken')

module.exports = {
  login: async (emails, pass) => {
    let email = emails.toLowerCase().trim()// Covert Lower and Split Space First and Last
    if (email.split('@').length <= 1) { // Verify Email
      return {status: 404, message: 'Email not definded'}
    }
    let user = await User.findOne({email}) // Find user
    // console.log(user)
    if (!user) { // Check Have user
      return {status: 404, message: 'Account not exist'}
    }
    if (user.password !== pass) { // Check Pass word
      return {status: 404, message: 'Password is wrong'}
    }
    // Code Token and Return Client
    let token = jwt.sign({id: user.id, username: user.username, email: user.email, avatarLink: user.avatar}, 'PesiSecretKey', {expiresIn: '1h'})
    return {status: 200, token, message: 'Get Token Complete'}
  },
  verifyToken: (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      next()
    } else {
      res.sendStatus(403)
    }
  },
  signup: async (username, email, pass, passconfirm, avatar) => {
    let emails = email.toLowerCase().trim()// Covert Lower and Split Space First and Last
    if (emails.split('@').length <= 1) { // Verify Email
      return {status: 404, message: 'Email not definded'}
    }
    let UserEmail = await User.find({email})
    if (UserEmail.length > 0) {
      return {status: 404, message: 'Email\' exist'}
    }
    if (pass !== passconfirm) {
      return {status: 404, message: 'Password not similar'}
    }
    let user = new User()
    user.username = username
    user.email = email
    user.password = pass
    user.avatar = avatar
    user.save()
    console.log('SignUp Complete: ' + user)
    return {status: 200, message: 'Signup Complete'}
  }
}
