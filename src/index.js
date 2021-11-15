// Instantiate Discord.js
const { Client, Intents } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

// Create a new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// On client ready (after login), run this once
client.once("ready", () => {
  console.log("Ready!");
});

// Login to Discord
client.login(token);
