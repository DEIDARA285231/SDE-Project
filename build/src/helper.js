"use strict";
/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = exports.getGameNameFromRequest = exports.getDateFromRequest = exports.getIdFromRequest = exports.getStringFromRequest = exports.getNumberFromRequest = void 0;
/**
 * Extract a specific parameter from the query-string
 * @param req The request (as given in the controller)
 * @param param The id of the parameter to be extracted
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
exports.getNumberFromRequest = function (req, param) {
    var value = req.query[param];
    if (typeof value !== 'string') {
        return false;
    }
    try {
        return parseInt(value);
    }
    catch (e) {
        console.error("Error extracting parameter " + param + ":", e);
        return false;
    }
};
/**Function to get the name from the first page */
exports.getStringFromRequest = function (req, param) {
    var value = req.query[param];
    if (typeof value !== "string") {
        return false;
    }
    try {
        return String(value);
    }
    catch (e) {
        console.error('Error extracting parameter ${param}:', e);
        return false;
    }
};
/**
 * Extract id from the request query-string
 * @param req The request (as given in the controller)
 * @return the id if the parameter is correct and
 * available, false otherwise
 */
exports.getIdFromRequest = function (req) {
    return exports.getNumberFromRequest(req, 'game_id');
};
/**
 * Extract day, month and year from the request query-string
 * @param req The request (as given in the controller)
 * @return an object containing day, month and year parameters
 * if the parameter for the day/month/year is not available,
 * the current day/month/year will be used
 */
exports.getDateFromRequest = function (req) {
    var day = exports.getNumberFromRequest(req, 'd');
    var month = exports.getNumberFromRequest(req, 'm');
    var year = exports.getNumberFromRequest(req, 'y');
    var currentDate = exports.getCurrentDate();
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
exports.getGameNameFromRequest = function (req) {
    return exports.getStringFromRequest(req, "name");
};
/**
 * Returns the current day
 * @return an object containing day, month and years parameters
 * representing the current date (today)
 */
exports.getCurrentDate = function () {
    var date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    };
};
