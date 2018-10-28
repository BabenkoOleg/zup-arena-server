const SteamWebAPI = require('steam-web-api2');

const service = new SteamWebAPI(process.env.STEAM_API_KEY);

module.exports = service;
