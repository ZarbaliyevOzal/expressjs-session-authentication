require('dotenv').config()
const express = require('express')
const flash = require('connect-flash')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session')
const authRoutes = require('./router/auth')
const defaultRoutes = require('./router/default')

app.use(express.static('public'))

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'super-secret'
}))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())

app.set('view engine', 'ejs')

app.use(function(req, res, next) {
  res.locals.errors = req.flash('errors') || []
  next()
})

// routes
app.use(defaultRoutes)
app.use(authRoutes)

app.listen(process.env.APP_PORT, () => console.log(`listening on port http://localhost:${process.env.APP_PORT}`))