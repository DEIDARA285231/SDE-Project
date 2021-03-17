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
    if(!Number.isNaN(parseInt(value))) {
      return parseInt(value);
    } else {
      return false;
    }
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

/**Function to get the Name from the first page, otherwise use Minecraft */
export const getGameNameFromRequest : (req: Request) => string | false = (req) => {
  return getStringFromRequest(req, "name");
}