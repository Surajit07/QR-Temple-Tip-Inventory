// require("dotenv").config();

// module.exports = {
//   PORT: process.env.PORT || 8000,
//   APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL,
// };

import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT || 8000;
export const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;