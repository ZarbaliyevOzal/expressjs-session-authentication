const router = require('express').Router()
const DefaultController = require('../controllers/DefaultController')
const authenticate = require('../middlewares/authenticate')
const csrfProtection = require('csurf')()

router.get('/home', [authenticate, csrfProtection], DefaultController.home)

module.exports = router