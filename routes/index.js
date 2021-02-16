const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { getTopGamesTwitch } = require('../src/twitch/core')
import axios from 'axios';
import { getIdFromRequest, getGameNameFromRequest} from '../src/helper';


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
    const topGames = await axios({
      url: "http://localhost:3000/api/twitch/topGames",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const topRated = await axios({
      url: "http://localhost:3000/api/games/topRated",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const topStreams = await axios({
      url: "http://localhost:3000/api/twitch/streams",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    //convert the box_art_url to a url that can be accepted by html
    for(var i=0; i<topGames.data.data.length; i++) {
      var tmp = (topGames.data.data[i]["box_art_url"]).split("-{");
      topGames.data.data[i]["box_art_url"] = tmp[0] + ".jpg"
    }

    //converti unix timestamp to date and rate to only two decimals
    for(var i=0; i<topRated.data.length; i++) {
      var dat = new Date(topRated.data[i].first_release_date * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = dat.getFullYear();
      var month = months[dat.getMonth()];
      var day = dat.getDate();
      topRated.data[i].first_release_date = ''+day+' '+month+' '+year;
      var rat = ''+topRated.data[i].rating+'';
      topRated.data[i].rating = rat.substring(0,4);
    }

    res.render('dashboard', {
      name: req.user.firstName,
      twitchTop: {
        entry0: topGames.data.data[0],
        entry1: topGames.data.data[1],
        entry2: topGames.data.data[2],
        entry3: topGames.data.data[3],
        entry4: topGames.data.data[4],
        entry5: topGames.data.data[5],
        entry6: topGames.data.data[6],
        entry7: topGames.data.data[7],
        entry8: topGames.data.data[8],
        entry9: topGames.data.data[9],
        entry10: topGames.data.data[10],
        entry11: topGames.data.data[11],
        entry12: topGames.data.data[12],
        entry13: topGames.data.data[13],
        entry14: topGames.data.data[14],
        entry15: topGames.data.data[15],
        entry16: topGames.data.data[16],
        entry17: topGames.data.data[17],
        entry18: topGames.data.data[18],
        entry19: topGames.data.data[19]
      },
      IGDBtop: {
        entry0: topRated.data[0],
        entry1: topRated.data[1],
        entry2: topRated.data[2],
        entry3: topRated.data[3],
        entry4: topRated.data[4],
        entry5: topRated.data[5],
        entry6: topRated.data[6],
        entry7: topRated.data[7],
        entry8: topRated.data[8],
        entry9: topRated.data[9],
      },
      twitchStreams: {
        entry0: topStreams.data.data[0].user_login,
        entry1: topStreams.data.data[1].user_login,
        entry2: topStreams.data.data[2].user_login,
      }
    })
  } catch(err) {
    console.log(err)
    res.render('error/500')
  }
})

// @desc Game page
// @route GET /game
router.get('/game', ensureAuth, async (req,res) => {
  try {
    const id = getIdFromRequest(req);
    const name = getGameNameFromRequest(req);
    if(id !== false) {
      const game = await axios({
        url: `http://localhost:3000/api/games?id=${id}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const cover = await axios({
        url: `http://localhost:3000/api/game/covers?id=${id}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      var url = "https:"+cover.data[0].url

      console.log(game)

      console.log(url)
      res.render('game', {
        id: game.data[0].id,
        name: game.data[0].name,
        storyline: game.data[0].storyline,
        summary: game.data[0].summary,
        cover: url,
        rating: game.data[0].total_rating
      });

    } else if(name !== false) {
      const game = await axios({
        url: `http://localhost:3000/api/games?name=${name}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      res.render('error/420')
    } else {
      throw err;
    }
  } catch(err) {
    console.log(err)
    res.render('error/500')
  }
})

module.exports = router
