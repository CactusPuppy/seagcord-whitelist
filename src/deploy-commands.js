require("dotenv").config();
const fs = require("fs");
const token = process.env.DISCORD_TOKEN;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = require("../config.json");

// Prepare to register all commands in src/commands
const commands = [];
fs.readdirSync("./src/commands").filter(file => file.endsWith(".js")).forEach(file => {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
});

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

