/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */

export interface Error {
  error: any;
}

export const isError = (arg: any): arg is Error => {
  return arg && arg.error;
};

export interface GameInfos {
  ID: number;
  name: String;
  hours: number;
  price: number;
  PHratio: number;
  mark: number;
  reviews: [String];
  genres: [String];
}
/**
 * @typedef GameInfos
 * @property {integer} ID - ID of the game
 * @property {string} name - Complete Name of the game
 * @property {integer} hours - Numbers of hours in order to complete the game
 * @property {integer} price - Current price of the game
 * @property {integer} PHratio - Price/Hours ratio
 * @property {integer} mark - Current rating of the game
 * @property {Array.<string>} reviews - Reviews of the game
 * @property {Array.<string>} genres - Genres of the game
 */

export interface Externals{
  gameName: string;
  gameId: number;
  steamId?: number;
  gogId?: number;
  twitchId?: number;
  itad_plain?: string;
}
/**
 * @typedef Externals
 * @property {string} gameName.required -Complete Name of the game
 * @property {integer} gameId.required - ID used on IGDB
 * @property {integer} steamId - ID used on Steam's platform
 * @property {integer} gogId - ID used on Gog's platform
 * @property {integer} twitchId - ID used on Twitch's platform
 * @property {integer} itad_plain - ID used on ITAD's platform
 */

export interface ArtworkCoverIGDB{
  id: number;
  game: string;
  width: number;
  height: number;
  url: string;
}
/**
 * @typedef ArtworkCoverIGDB
 * @property {integer} id.required -Complete Name of the game
 * @property {string} game.required - ID used on IGDB
 * @property {integer} width.required - ID used on Steam's platform
 * @property {integer} height.required - ID used on Gog's platform
 * @property {string} url.required - ID used on Twitch's platform
 */


export interface IGDBGame{
  id: number;
  name: string;
  first_release_date: string;
  aggregated_rating?: number;
  rating?: number;
  storyline?: string;
  summary?: string;
  genres?: number[];
}
/**
 * @typedef IGDBGame
 * @property {integer} id
 * @property {string} name
 * @property {string} first_release_date
 * @property {integer} aggregated_rating
 * @property {integer} rating
 * @property {string} storyline
 * @property {string} summary
 * @property {Array.<integer>} genres
 */

export interface IGDBVideo{
  gameId: number;
  video_name: String;
  videoId: String;
}
/**
 * @typedef IGDBVideo
 * @property {integer} gameId
 * @property {string} video_name
 * @property {string} videoId
 */

export interface IGDBPlatform{
  id: number;
  name: string;
  alternative_name: string;
  platform_logo_url: string;
}
/**
 * @typedef IGDBPlatform
 * @property {integer} id
 * @property {string} name
 * @property {string} alternative_name
 * @property {string} platform_logo_url
 */

export interface IGDBPlatformLogo{
  id: number;
  width: number;
  height: number;
  url: string;
}
/**
 * @typedef IGDBPlatformLogo
 * @property {integer} id
 * @property {integer} width
 * @property {integer} height
 * @property {string} url
 */
