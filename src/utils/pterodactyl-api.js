const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const pterodactylDomain = process.env.PTERODACTYL_DOMAIN;
require("dotenv").config();

module.exports = {
  whitelistUser,
  unwhitelistUser,
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
        return { "error": `HTTP Status ${response.status} ${response.statusText}` };
      }
      return {};
    });
}

/**
 * Un-whitelists a Minecraft user
 * @param {String} name Username to unwhitelist
 * @param {String} serverId Identifier for server
 */
async function unwhitelistUser(name, serverId) {
  return fetch(pterodactylAPIDomain + `/api/client/servers/${serverId}/command`, {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`,
    },
    "body": JSON.stringify({
      "command": `whitelist remove ${name}`,
    }),
  })
    .then(async response => {
      if (response.status === 502) {
        return { "error": "Server offline" };
      } else if (!response.ok) {
        return { "error": `HTTP Status ${response.status} ${response.statusText}` };
      }
      return {};
    });
}
