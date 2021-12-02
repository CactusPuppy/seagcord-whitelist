// @ts-check

const { CommandInteraction } = require("discord.js");
const { SlashCommandBuilder, bold, inlineCode } = require("@discordjs/builders");
const { uuidToUsername } = require("../utils/mojang-api");
const { unwhitelistUser } = require("../utils/pterodactyl-api");
const pterodactylServerIdentifier = process.env.PTERODACTYL_SERVER_IDENTIFIER;
const whitelistChannelId = process.env.DISCORD_WHITELIST_CHANNEL_ID;
const models = require("../database/models");
const WhitelistEntry = models["WhitelistEntry"];
require("dotenv").config();


module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwhitelist")
    .setDescription("Removes the Minecraft account associated with your Discord account from the server."),
  /**
   *
   * @param {CommandInteraction} interaction
   * @returns Nothing
   */
  async execute(interaction) {
    // ACK the interaction
    if (interaction.channelId.toString() !== whitelistChannelId) {
      await interaction.reply({
        content:      `You must use the <#${whitelistChannelId}> channel for whitelist commands.`,
        ephemeral:    true,
      });
      return;
    }
    await interaction.deferReply();

    // Find account username
    const previousEntry = await WhitelistEntry.findByPk(interaction.user.id);
    if (previousEntry === null) {
      interaction.editReply(`You haven't been whitelisted yet. Feel free to do so via ${inlineCode("/whitelist")}!`);
      return;
    }

    // Double-check account exists
    let data = await uuidToUsername(previousEntry.mcUUID);
    if (data.error) {
      if (data.error !== "Player not found") {
        interaction.editReply(data.error);
        return;
      }
      const deleted = await previousEntry.destroy();
      if (!deleted) {
        throw new Error(`Failed to clean up entry for UUID ${previousEntry.mcUUID} after removing non-existent player`);
      }
      return;
    }
    const username = data.name;
    // If Mojang API call fails, let user know
    if (data.webError) {
      interaction.editReply(`Mojang authentication failed: ${data.webError}`);
      return;
    }

    // Put in a request for unwhitelisting
    data = await unwhitelistUser(username, pterodactylServerIdentifier);
    if (data.error) {
      interaction.editReply(`Request to server failed: ${data.error}`);
      return;
    }
    const deleted = await previousEntry.destroy();
    if (!deleted) {
      throw new Error(`Failed to clean up whitelist entry for ${username}`);
    }

    interaction.editReply(`${bold(username)} has been removed from the server.`);
  },
};
