export interface Error {
    error: any;
  }
  
  export const isError = (arg: any): arg is Error => {
    return arg && arg.error;
  };
  
  export interface TwitchGames {
    id: number;
    name: String;
    box_art_url: String;
  }
  /**
   * @typedef TwitchGames
   * @property {integer} id.required -Complete Name of the game
   * @property {string} name.required - ID used on IGDB
   * @property {string} box_art_url.required - ID used on Steam's platform
   */
  
  export interface TwitchVideo {
    game_id: String;
    user_name: String;
    title: String;
    url: String;
    view_count: number;
    type: string;
    language: string;
    duration: string;
  }
  /**
   * @typedef TwitchVideo
   * @property {string} game_id.required -Complete Name of the game
   * @property {string} user_name.required - ID used on IGDB
   * @property {string} title.required - ID used on Steam's platform
   * @property {string} url.required - ID used on Gog's platform
   * @property {integer} view_count.required - ID used on Twitch's platform
   * @property {string} type.required -
   * @property {string} language.required -
   * @property {string} duration.required -
   */
  
  export interface TwitchStream{
    user_name: string;
    viewer_count: number;
    game_name: string;
    game_id: number;
    title: string;
    language: string;
  }
  /**
   * @typedef TwitchStream
   * @property {string} user_name.required -Complete Name of the game
   * @property {integer} viewer_count.required - ID used on IGDB
   * @property {string} game_name.required - ID used on Steam's platform
   * @property {integer} game_id.required - ID used on Gog's platform
   * @property {string} title.required - ID used on Twitch's platform
   * @property {string} language.requited -
   */
  
  export interface TwitchTopGame{
    id: number;
    name: string;
    box_art_url: string;
  }
  /**
   * @typedef TwitchTopGame
   * @property {integer} id.required
   * @property {string} name.required
   * @property {string} box_art_url.required
   */  