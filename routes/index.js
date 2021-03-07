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
  files: ['../src/itad/routes.js', "../src/steam/routes.js", "../src/twitch/routes.js", "../src/routes.js", "../src/types.js"] //Path to the API handle folder
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
      //get the prices
      try {
        const prices = await axios({
          url: `http://localhost:3000/api/itad/storeLow?id=${id}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch(e) {
        const prices = undefined;
      }
      //format the cover URL
      var url = "";
      if(!isError(cover) && cover !==(undefined) && cover.data.length!=0) {
        url = "https://"+cover.data[0].url
      } else {
        url = "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg"
      }
      //aggregated_rating check and format
      if(typeof game.data.aggregated_rating === 'undefined') {
        game.data.aggregated_rating = 'N/A'
      } else {
        let rat = ''+game.data.aggregated_rating+'';
        game.data.aggregated_rating = rat.substring(0,4);
      }
      //rating check and format
      if(typeof game.data.rating === 'undefined') {
        game.data.rating = 'N/A'
      } else {
        let rat = ''+game.data.rating+'';
        game.data.rating = rat.substring(0,4);
      }
      //date format
      var dat = ''+game.data.first_release_date+'';
      if(dat != "Invalid Date") {
        game.data.first_release_date = dat.substring(5,16)
      }

      var pricesArray = [];

      if(prices !== undefined) {
        for(let i=0; i<prices.data.stores.length; i++) {
          switch(prices.data.stores[i].storeName) {
            case "amazonus":
              prices.data.stores[i].storeName = "Amazon";
              break;
            case "steam":
              prices.data.stores[i].storeName = "Steam";
              break;
            case "origin":
              prices.data.stores[i].storeName = "Origin";
              break;
            case "epic":
              prices.data.stores[i].storeName = "Epic Games";
              break;
            case "gog":
              prices.data.stores[i].storeName = "GOG.com";
              break;
            default:
              break;
          }
          pricesArray.push(prices.data.stores[i])
        }
      }

      //render views/game with these params
      res.render('game', {
        data: game.data,
        cover: url,
        prices: pricesArray
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
      //get the results on Twitch given the name
      const twitchSearch = await axios({
        url: `http://localhost:3000/api/twitch/search?query=${name}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      //arrays of items we'll pass to handlebars
      var search = [];
      var twitch = [];

      //we format and then push the items in the array we use on the frontend
      for(let i=0; i<game.data.length; i++) {
        var dat = ''+game.data[i].first_release_date+'';
        if(dat != "Invalid Date") {
          game.data[i].first_release_date = dat.substring(5,16)
        }
        search.push(game.data[i])
      }
      //we format and then push the items in the array we use on the frontend
      for(let i=0; i<twitchSearch.data.data.length; i++) {
        var img = twitchSearch.data.data[i].box_art_url;
        img = img.split("52x72.jpg")
        twitchSearch.data.data[i].box_art_url = img[0]+"520x720.jpg"
        twitch.push(twitchSearch.data.data[i])
      }

      res.render('gameList', {
        query: name,
        length: game.data.length,
        search: search,
        twitch: twitch
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
