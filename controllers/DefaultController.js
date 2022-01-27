const knex = require('../config/database')

class DefaultController {
  async home(req, res) {
    const user = await knex('users')
      .select(['id', 'name', 'email', 'created_at', 'updated_at', 'verified_at', 'deleted_at'])
      .where('id', req.session.userId)
      .first()
      .then((res) => res)
    res.render('default/home', {
      user: user,
      sessionId: req.session.userId
    })
  }
}

module.exports = new DefaultController()