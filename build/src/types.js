"use strict";
/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = void 0;
exports.isError = function (arg) {
    return arg && arg.error;
};
