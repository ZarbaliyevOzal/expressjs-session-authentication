const bcrypt = require('bcrypt')
const knex = require('../config/database')
const { object, string } = require('yup')

class AuthController {

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  getLogin(req, res) {
    res.render('login', { _csrf: req.csrfToken() })
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async postLogin(req, res) {
    const schema = object({
      email: string().email().required(),
      password: string().required()
    })
    const errors = await schema.validate(req.body, { abortEarly: false })
      .catch((err) => err.errors)
    if (errors && errors.length) {
      req.flash('errors', errors)
      return res.redirect('/login')
    }

    const user = await knex('users').where('email', req.body.email).first().then((res) => res)
    if (!user) {
      req.flash('errors', ['Email or password are wrong'])
      return res.redirect('/login')
    }
    
    const checkHash = await bcrypt.compare(req.body.password, user.password).then((result) => result)
    if (!checkHash) {
      req.flash('errors', ['Email or password are wrong'])
      return res.redirect('/login')
    } 
    
    // set session
    req.session.userId = user.id

    return res.redirect('/home')
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  getRegister(req, res) {
    res.render('register', { _csrf: req.csrfToken() })
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async postRegister(req, res) {
    const schema = object({
      name: string().required().max(45),
      email: string().email().required().max(255)
        .test('unique', 'Email already in use', async function(value) {
          if (await knex('users').where('email', value).first().then((res) => res)) {
            return false
          } 
          return true
        }),
      password: string().required().max(12)
    })

    const errors = await schema.validate(req.body, { abortEarly: false, strict: false })
      .catch((err) => {
        req.flash('errors', err.errors)
        return err.errors
      })
    if (errors && errors.length) return res.redirect('/register')

    // hash password
    let password = await bcrypt.hashSync(req.body.password, 12)

    // create user
    const id = await knex.insert({ name: req.body.name, email: req.body.email, password: password })
      .into('users')
      .then((res) => res[0])

    // set session
    req.session.userId = id

    return res.redirect('/home')
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}

module.exports = AuthController