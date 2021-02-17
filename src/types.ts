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

export interface Externals{
  gameName: string;
  gameId: number;
  steamId?: number;
  gogId?: number;
  twitchId?: number;
  itad_plain?: string;
}

export interface ArtworkCoverIGDB{
  id: number;
  game: number;
  width: number;
  height: number;
  url: string;
}

export interface TwitchGames {
  id: number;
  name: String;
  box_art_url: String;
}

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

export interface TwitchStream{
  user_name: string;
  viewer_count: number;
  game_name: string;
  game_id: string;
  title: string;
  language: string;
}

export interface TwitchTopGame{
  id: string;
  name: string;
  box_art_url: string;
}

export interface IGDBGame{
  id: number;
  first_release_date: string;
  aggregated_rating: number;
  name: string;
  rating: number;
  storyline: string;
  summary: string;
  genres: number[];
}
