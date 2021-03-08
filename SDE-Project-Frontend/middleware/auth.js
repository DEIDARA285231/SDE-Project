const User = require('../../SDE-Project-DB/models/User')

module.exports = {
  ensureAuth: function (req, res, next) {
    if(req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
  },
  ensureGuest: function(req, res, next) {
    if(req.isAuthenticated()) {
      res.redirect('/dashboard')
    } else {
      return next();
    }
  }
  /*ensureAuthAPI: async function (req, res, next) {
    if(req.user !== undefined && req.user.googleId !== undefined) {
      let user = await User.findOne({ googleId: req.user.googleId })
      console.log(user.accessToken)
      if(user && user.accessToken == req.user.accessToken) {
        return next();
      }
    }
    res.sendStatus(401)
  }*/
}
