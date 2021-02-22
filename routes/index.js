const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { getTopGamesTwitch } = require('../src/twitch/core')
import axios from 'axios';
import { getIdFromRequest, getGameNameFromRequest} from '../src/helper';
import { isError } from '../src/types';

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'RESTful API documentation for SDE final project.',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/api/',
    produces: [
      "application/json",
      "application/xml"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "",
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['../src/itad/routes.js', "../src/steam/routes.js", "../src/twitch/routes.js", "../src/routes.js"] //Path to the API handle folder
};

expressSwagger(options)
app.listen(3001);

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
    for(var i=0; i<topGames.data.length; i++) {
      var tmp = (topGames.data[i]["box_art_url"]).split("-{");
      topGames.data[i]["box_art_url"] = tmp[0] + ".jpg"
    }

    //convert unix timestamp to date and rate to only two decimals
    for(var i=0; i<topRated.data.length; i++) {
      var dat = ''+topRated.data[i].first_release_date+'';
      topRated.data[i].first_release_date = dat.substring(5,16)

      var rat = ''+topRated.data[i].rating+'';
      topRated.data[i].rating = rat.substring(0,4);
    }

    res.render('dashboard', {
      name: req.user.firstName,
      twitchTop: {
        entry0: topGames.data[0],
        entry1: topGames.data[1],
        entry2: topGames.data[2],
        entry3: topGames.data[3],
        entry4: topGames.data[4],
        entry5: topGames.data[5],
        entry6: topGames.data[6],
        entry7: topGames.data[7],
        entry8: topGames.data[8],
        entry9: topGames.data[9],
        entry10: topGames.data[10],
        entry11: topGames.data[11],
        entry12: topGames.data[12],
        entry13: topGames.data[13],
        entry14: topGames.data[14],
        entry15: topGames.data[15],
        entry16: topGames.data[16],
        entry17: topGames.data[17],
        entry18: topGames.data[18],
        entry19: topGames.data[19]
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
        entry0: topStreams.data[0].user_name,
        entry1: topStreams.data[1].user_name,
        entry2: topStreams.data[2].user_name,
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
      //get the game informations given the ID
      const game = await axios({
        url: `http://localhost:3000/api/games?id=${id}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      //get the cover for the game
      const cover = await axios({
        url: `http://localhost:3000/api/game/covers?id=${id}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      //get the price on steam
      try {
        const steam = await axios({
          url: `http://localhost:3000/api/steam/price?id=${id}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch(e) {
        const steam = undefined;
      }
      //format the cover URL
      var url = "";
      if(!isError(cover) && cover !==(undefined) && cover.data.length!=0) {
        url = "https://"+cover.data[0].url
      } else {
        url = "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg"
      }
      //rating check and format
      if(typeof game.data.rating === 'undefined') {
        game.data.rating = 'N/A'
      } else {
        var rat = ''+game.data.rating+'';
        game.data.rating = rat.substring(0,4);
      }
      //date format
      var dat = ''+game.data.first_release_date+'';
      if(dat != "Invalid Date") {
        game.data.first_release_date = dat.substring(5,16)
      }

      var price = ""
      if(!isError(steam) && steam !==(undefined)) {
        price = ""+steam.data.price+" $"
      } else {
        price = "Not on Steam"
      }

      //render views/game with these params
      res.render('game', {
        data: game.data,
        cover: url,
        price: price
      });

    } else if(name !== false) {
      //get the game informations given the name
      const game = await axios({
        url: `http://localhost:3000/api/games?name=${name}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const twitchSearch = await axios({
        url: `http://localhost:3000/api/twitch/search?query=${name}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      for(var i=0; i<game.data.length; i++) {
        var dat = ''+game.data[i].first_release_date+'';
        if(dat != "Invalid Date") {
          game.data[i].first_release_date = dat.substring(5,16)
        }
      }

      for(var i=0; i<twitchSearch.data.data.length; i++) {
        var img = twitchSearch.data.data[i].box_art_url;
        img = img.split("52x72.jpg")
        twitchSearch.data.data[i].box_art_url = img[0]+"520x720.jpg"
      }

      res.render('gameList', {
        query: name,
        length: game.data.length,
        search: {
          entry0: 0<game.data.length ? game.data[0] : '',
          entry1: 1<game.data.length ? game.data[1] : '',
          entry2: 2<game.data.length ? game.data[2] : '',
          entry3: 3<game.data.length ? game.data[3] : '',
          entry4: 4<game.data.length ? game.data[4] : '',
          entry5: 5<game.data.length ? game.data[5] : '',
          entry6: 6<game.data.length ? game.data[6] : '',
          entry7: 7<game.data.length ? game.data[7] : '',
          entry8: 8<game.data.length ? game.data[8] : '',
          entry9: 9<game.data.length ? game.data[9] : '',
          entry10: 10<game.data.length ? game.data[10] : '',
          entry11: 11<game.data.length ? game.data[11] : '',
          entry12: 12<game.data.length ? game.data[12] : '',
          entry13: 13<game.data.length ? game.data[13] : '',
          entry14: 14<game.data.length ? game.data[14] : '',
          entry15: 15<game.data.length ? game.data[15] : '',
          entry16: 16<game.data.length ? game.data[16] : '',
          entry17: 17<game.data.length ? game.data[17] : '',
          entry18: 18<game.data.length ? game.data[18] : '',
          entry19: 19<game.data.length ? game.data[19] : '',
        },
        twitch: {
          entry0: 0<twitchSearch.data.data.length ? twitchSearch.data.data[0] : undefined,
          entry1: 1<twitchSearch.data.data.length ? twitchSearch.data.data[1] : '',
          entry2: 2<twitchSearch.data.data.length ? twitchSearch.data.data[2] : '',
          entry3: 3<twitchSearch.data.data.length ? twitchSearch.data.data[3] : '',
          entry4: 4<twitchSearch.data.data.length ? twitchSearch.data.data[4] : '',
          entry5: 5<twitchSearch.data.data.length ? twitchSearch.data.data[5] : '',
          entry6: 6<twitchSearch.data.data.length ? twitchSearch.data.data[6] : '',
          entry7: 7<twitchSearch.data.data.length ? twitchSearch.data.data[7] : '',
          entry8: 8<twitchSearch.data.data.length ? twitchSearch.data.data[8] : '',
          entry9: 9<twitchSearch.data.data.length ? twitchSearch.data.data[9] : '',
          entry10: 10<twitchSearch.data.data.length ? twitchSearch.data.data[10] : undefined,
          entry11: 11<twitchSearch.data.data.length ? twitchSearch.data.data[11] : '',
          entry12: 12<twitchSearch.data.data.length ? twitchSearch.data.data[12] : '',
          entry13: 13<twitchSearch.data.data.length ? twitchSearch.data.data[13] : '',
          entry14: 14<twitchSearch.data.data.length ? twitchSearch.data.data[14] : '',
          entry15: 15<twitchSearch.data.data.length ? twitchSearch.data.data[15] : '',
          entry16: 16<twitchSearch.data.data.length ? twitchSearch.data.data[16] : '',
          entry17: 17<twitchSearch.data.data.length ? twitchSearch.data.data[17] : '',
          entry18: 18<twitchSearch.data.data.length ? twitchSearch.data.data[18] : '',
          entry19: 19<twitchSearch.data.data.length ? twitchSearch.data.data[19] : '',
        }
      });
    } else {
      throw err;
    }
  } catch(err) {
    console.log(err)
    res.render('error/500')
  }
})

module.exports = router
