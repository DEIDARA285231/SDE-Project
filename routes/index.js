const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { getTopGamesTwitch } = require('../src/core')


// @desc Login/Landing Page
// @route GET /
router.get('/', ensureGuest, (req,res) => {
  res.render('login',{
    layout: 'login',
  })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req,res) => {
  try {
    const topGames = await getTopGamesTwitch()
    console.log(topGames.data[1])
    res.render('dashboard', {
      name: req.user.firstName,
      id1: topGames.data[1],
      id2: topGames.data[2]
    })
  } catch(err) {
    console.log(err)
    res.render('error/500')
  }

})

module.exports = router
