const router = require('express').Router()
const csrfProtection = require('csurf')()
const AuthController = new (require('../controllers/AuthController'))()
const authenticate = require('../middlewares/authenticate')
const guest = require('../middlewares/guest')

router.get('/login', [guest, csrfProtection], AuthController.getLogin)

router.post('/login', [guest, csrfProtection], AuthController.postLogin)

router.get('/register', [guest, csrfProtection], AuthController.getRegister)

router.post('/register', [guest, csrfProtection], AuthController.postRegister)

router.post('/logout', AuthController.logout)

module.exports = router