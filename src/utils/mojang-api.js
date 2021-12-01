const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const mojangAPI = "https://api.mojang.com/";

module.exports = {
  usernameToUUID,
};

/**
 * Makes a request to the Mojang API to convert a username into a UUID.
 * @param {String} name The username to convert to a UUID
 * @returns A JSON object containing the username and UUID, or a JSON object containing an error
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
