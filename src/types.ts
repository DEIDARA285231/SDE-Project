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

/*
export interface Region {
  id: number;
  name: string;
  lat: number;
  long: number;
}

export interface CasesPerRegion {
  region: Region;
  cases: number;
}

export interface Entry {
  hospitalized_with_symptoms: number;
  intensive_care: number;
  total_hospitalized: number;
  home_isolation: number;
  total_positive: number;
  total_positive_variation: number;
  new_positives: number;
  resigned_cured: number;
  deceased: number;
  cases_from_suspected_diagnostic: number;
  cases_from_screening: number;
  total_cases: number;
  tampons: number;
  cases_tested: number;
}*/

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
  twitchId: number;
  itad_plain?: string;
}

export interface TwitchGames {
  id: number;
  name: String;
  box_art_url: String;
}

export interface TwitchVideos {
  user_name: String;
  title: String;
  url: String;
  view_count: number;
  type: string;
  language: string;
  duration: string;
}

export interface TwitchStreams {
  user_name: string;
  viewer_count: number;
  game_name: string;
  game_id: string;
  title: string;
  language: string;
}