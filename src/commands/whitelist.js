const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { usernameToUUID } = require("../utils/mojang-api");
const { whitelistUser } = require("../utils/pterodactyl-api");
const { pterodactylServerIdentifier } = require("../../config.json");
require("dotenv").config();


module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Request to be whitelisted.")
    .addStringOption(option =>
      option.setName("username")
        .setDescription("A Minecraft: Java Edition username to whitelist.")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.getString("username");
    if (!(/^[A-Za-z0-9_]{3,16}$/.test(username))) {
      interaction.editReply({
        content: "That doesn't look like a valid Java Edition username. Please try again.",
        ephemeral: true,
      });
      return;
    }

    // Double-check account exists
    let data = await usernameToUUID(username);
    if (data.error) {
      interaction.editReply({
        content: data.error,
        ephemeral: true,
      });
      return;
    }
    // If Mojang API call fails, let user know
    if (data.webError) {
      interaction.editReply(`Mojang authentication failed: ${data.webError}`);
      return;
    }

    // Put in a request for whitelisting
    data = await whitelistUser(username, pterodactylServerIdentifier);
    if (data.error) {
      interaction.editReply(`Request to server failed: ${data.error}`);
      return;
    }

    interaction.editReply(`${bold(username)} has been whitelisted!`);
    // TODO: Prevent user from whitelisting more than once
  },
};
