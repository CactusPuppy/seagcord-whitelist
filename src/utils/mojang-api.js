const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const mojangAPI = "https://api.mojang.com";
const mojangSessionServer = "https://sessionserver.mojang.com";

module.exports = {
  usernameToUUID,
  uuidToUsername,
};

/**
 * Makes a request to the Mojang API to convert a username into a UUID.
 * @param {String} name The username to convert to a UUID
 * @returns {dictionary} A JSON object containing the username and UUID, or a JSON object containing an error
 */
async function usernameToUUID(name) {
  const response = await fetch(mojangAPI + `/users/profiles/minecraft/${encodeURIComponent(name)}`);
  if (!response.ok) {
    return { "webError": `${response.status} ${response.statusText}` };
  } else if (response.status == 204) {
    return { "error": "Player not found" };
  }
  return response.json();
}

/**
 * A function to fetch the username of a player from their UUID
 * @param {String} uuid The UUID to fetch
 * @returns {dictionary} A JSON object containing the username and UUID along with some properties
 */
async function uuidToUsername(uuid) {
  const response = await fetch(mojangSessionServer + `/session/minecraft/profile/${uuid}`);
  if (!response.ok) {
    return { "webError": `${response.status} ${response.statusText}` };
  } else if (response.status == 204) {
    return { "error": "Player not found" };
  }
  return response.json();
}
