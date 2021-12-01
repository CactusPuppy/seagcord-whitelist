const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const { pterodactylDomain } = require("../../config.json");
require("dotenv").config();

module.exports = {
  whitelistUser,
};

const pterodactylAPIDomain = pterodactylDomain || "https://pterodactyl.app";

/**
 * Attempt to whitelist a user on a server
 * @param {String} name         username to attempt to whitelist
 * @param {String} serverId     Identifier for server within Pterodactyl Panel
 */
async function whitelistUser(name, serverId) {
  return fetch(pterodactylAPIDomain + `/api/client/servers/${serverId}/command`, {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`,
    },
    "body": JSON.stringify({
      "command": `whitelist add ${name}`,
    }),
  })
    .then(async response => {
      if (response.status === 502) {
        return { "error": "Server offline" };
      } else if (!response.ok) {
        console.log(await response.json());
        return { "error": `HTTP Status ${response.status} ${response.statusText}` };
      }
      return {};
    });
}
