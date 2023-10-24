const express = require('express')
const cryptoJs = require('crypto-js')
const multer = require('multer')
const upload = multer({ dest: 'uploads' })
const jwt = require('jsonwebtoken')
const config = require('../config')

const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.post('/register', (request, response) => {
  const { firstName, lastName, email, mobile, password } = request.body

  // encrypt the password
  const encryptedPassword = String(cryptoJs.SHA256(password))

  db.query(
    'INSERT INTO users(firstName, lastName, email, mobile, password) VALUES(?, ?, ?, ?, ?)',
    [firstName, lastName, email, mobile, encryptedPassword],
    (error, result) => {
      response.send(utils.createResult(error, result))
    }
  )
})

router.post('/login', (request, response) => {
  const { email, password } = request.body

  // encrypt the password
  const encryptedPassword = String(cryptoJs.SHA256(password))

  const statement = 'SELECT * FROM users WHERE email=? and password=?'
  db.query(statement, [email, encryptedPassword], (error, users) => {
    if (users.length == 0) {
      // if user does not exist, users array will be empty
      response.send(utils.createResult('user does not exist'))
    } else {
      // if user exists, the users will be an array with one user entry
      const user = users[0]

      // create a payload
      const payload = {
        id: user['id'],
        name: `${user['firstName']} ${user['lastName']}`,
      }

      // create a token
      const token = jwt.sign(payload, config.secret)

      response.send(
        utils.createResult(null, {
          name: `${user['firstName']} ${user['lastName']}`,
          mobile: user['mobile'],
          token: token,
        })
      )
    }
  })
})

module.exports = router
