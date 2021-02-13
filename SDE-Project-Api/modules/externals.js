const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExternalsSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true
  },
  gameId: {
    type: number,
    required: true
  },
  steamId: {
    type: number,
    required: true
  },
  gogId: {
    type: number,
    required: true
  },
  youtubeId: {
    type: number,
    required: true
  },
  twitchId: {
    type: number,
    required: true
  }
})


const Game = mongoose.model("game", ExternalsSchema);

module.exports = Game;
