//DB Schema for the game table

const mongoose = require('mongoose')

const ExternalsSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  steamId: {
    type: Number
  },
  gogId: {
    type: Number
  },
  twitchId: {
    type: Number
  },
  itad_plain: {
    type: String
  }
})

module.exports = mongoose.model("Externals", ExternalsSchema)
