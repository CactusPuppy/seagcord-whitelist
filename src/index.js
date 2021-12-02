// Instantiate Discord.js
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;

// Create a new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Register all the commands in the src/commands directory
client.commands = new Collection();
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// On client ready (after login), run this once
client.once("ready", () => {
  console.log("Ready!");
});

// Register handler for slash commands
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  // If a command came from a different guild than the one we care about, ignore it
  if (interaction.guildId !== process.env.DISCORD_GUILD_ID) return;

  // If this was not from a guild, reject
  if (!interaction.inGuild()) {
    await interaction.reply("Commands are not useable outside of servers.");
  }

  // Fetch the command to execute
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    interaction.reply("PupBot doesn't recognize that command. Sorry :/");
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const reply = "PupBot ran into a problem while running this command :/";
    if (interaction.replied) return;
    if (interaction.deferred) {
      await interaction.editReply({
        content: reply,
        ephemeral: true,
      });
      return;
    }
    await interaction.reply({
      content: reply,
      ephemeral: true,
    });
  }
});

// Login to Discord
client.login(token);
