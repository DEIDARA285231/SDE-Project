/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */

import { Request } from 'express';

/**
 * Extract a specific parameter from the query-string
 * @param req The request (as given in the controller)
 * @param param The id of the parameter to be extracted
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getNumberFromRequest: (req: Request, param: string) => number | false = (
  req,
  param
) => {
  let value = req.query[param];

  if (typeof value !== 'string') {
    return false;
  }

  try {
    return parseInt(value);
  } catch (e) {
    console.error(`Error extracting parameter ${param}:`, e);
    return false;
  }
};

/**Function to get the name from the first page */
export const getStringFromRequest: (req: Request, param: string) => string | false = (
  req,
  param
) => {
  let value = req.query[param]

  if(typeof value !== "string"){
    return false;
  }

  try{
    return String(value);
  }catch (e) {
    console.error('Error extracting parameter ${param}:', e);
    return false;
  }
}
/**
 * Extract id from the request query-string
 * @param req The request (as given in the controller)
 * @return the id if the parameter is correct and
 * available, false otherwise
 */
export const getIdFromRequest: (req: Request) => number | false = (req) => {
  return getNumberFromRequest(req, 'id');
};

/**
 * Extract day, month and year from the request query-string
 * @param req The request (as given in the controller)
 * @return an object containing day, month and year parameters
 * if the parameter for the day/month/year is not available,
 * the current day/month/year will be used
 */
export const getDateFromRequest: (
  req: Request
) => {
  day: number;
  month: number;
  year: number;
} = (req) => {
  let day = getNumberFromRequest(req, 'd');
  let month = getNumberFromRequest(req, 'm');
  let year = getNumberFromRequest(req, 'y');

  const currentDate = getCurrentDate();
  if (day === false) {
    day = currentDate.day;
  }
  if (month === false) {
    month = currentDate.month;
  }
  if (year === false) {
    year = currentDate.year;
  }

  return {
    day: day,
    month: month,
    year: year,
  };
};

/**Function to get the Name from the first page, otherwise use Minecraft */
export const getGameNameFromRequest : (req: Request) => string | false = (req) => {
  return getStringFromRequest(req, "name");
}

/**
 * Returns the current day
 * @return an object containing day, month and years parameters
 * representing the current date (today)
 */
export const getCurrentDate: () => {
  day: number;
  month: number;
  year: number;
} = () => {
  const date = new Date();
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const getGenres: () => any = () =>{
  return {
    2: {
      "name": "Point-and-click",
      "url": "https://www.igdb.com/genres/point-and-click"
    },
    4: {
      "name": "Fighting",
      "url": "https://www.igdb.com/genres/fighting"
    },
    5: {
      "name": "Shooter",
      "url": "https://www.igdb.com/genres/shooter"
    },
    7: {
      "name": "Music",
      "url": "https://www.igdb.com/genres/music"
    },
    8: {
      "name": "Platform",
      "url": "https://www.igdb.com/genres/platform"
    },
    9: {
      "name": "Puzzle",
      "url": "https://www.igdb.com/genres/puzzle"
    },
    10:{
      "name": "Racing",
      "url": "https://www.igdb.com/genres/racing"
    },
    11: {
      "name": "Real Time Strategy (RTS)",
      "url": "https://www.igdb.com/genres/real-time-strategy-rts"
    },
    12: {
      "name": "Role-playing (RPG)",
      "url": "https://www.igdb.com/genres/role-playing-rpg"
    },
    13: {
      "name": "Simulator",
      "url": "https://www.igdb.com/genres/simulator"
    },
    14: {
      "name": "Sport",
      "url": "https://www.igdb.com/genres/sport"
    },
    15:{
      "name": "Strategy",
      "url": "https://www.igdb.com/genres/strategy"
    },
    16: {
      "name": "Turn-based strategy (TBS)",
      "url": "https://www.igdb.com/genres/turn-based-strategy-tbs"
    },
    24: {
      "name": "Tactical",
      "url": "https://www.igdb.com/genres/tactical"
    },
    25: {
      "name": "Hack and slash/Beat 'em up",
      "url": "https://www.igdb.com/genres/hack-and-slash-beat-em-up"
    },
    26: {
      "name": "Quiz/Trivia",
      "url": "https://www.igdb.com/genres/quiz-trivia"
    },
    30: {
      "name": "Pinball",
      "url": "https://www.igdb.com/genres/pinball"
    },
    31:{
      "name": "Adventure",
      "url": "https://www.igdb.com/genres/adventure"
    },
    32: {
      "name": "Indie",
      "url": "https://www.igdb.com/genres/indie"
    },
    33:{
      "name": "Arcade",
      "url": "https://www.igdb.com/genres/arcade"
    },
    34: {
      "name": "Visual Novel",
      "url": "https://www.igdb.com/genres/visual-novel"
    },
    35:{
      "name": "Card & Board Game",
      "url": "https://www.igdb.com/genres/card-and-board-game"
    },
    36:{
      "name": "MOBA",
      "url": "https://www.igdb.com/genres/moba"
    }
  }
}


