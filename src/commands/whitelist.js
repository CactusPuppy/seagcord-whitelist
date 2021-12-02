// @ts-check

const { CommandInteraction } = require("discord.js");
const { SlashCommandBuilder, bold, inlineCode } = require("@discordjs/builders");
const { usernameToUUID, uuidToUsername } = require("../utils/mojang-api");
const { whitelistUser } = require("../utils/pterodactyl-api");
const pterodactylServerIdentifier = process.env.PTERODACTYL_SERVER_IDENTIFIER;
const whitelistChannelId = process.env.DISCORD_WHITELIST_CHANNEL_ID;
const models = require("../database/models");
const WhitelistEntry = models["WhitelistEntry"];
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
  /**
   *
   * @param {CommandInteraction} interaction
   * @returns Nothing
   */
  async execute(interaction) {
    // ACK the interaction
    if (interaction.channelId !== whitelistChannelId) {
      await interaction.reply({
        content:      `You must use the <#${whitelistChannelId}> channel for whitelist commands.`,
        ephemeral:    true,
      });
      return;
    }
    await interaction.deferReply();

    // Validate the arguments
    const username = interaction.options.getString("username");
    if (username === null) {
      interaction.editReply("Please provide a username");
      return;
    }
    if (!(/^[A-Za-z0-9_]{3,16}$/.test(username))) {
      interaction.editReply("That doesn't look like a valid Java Edition username. Please try again.");
      return;
    }

    // Double-check this person hasn't already tried to whitelist
    const previousEntry = await WhitelistEntry.findByPk(interaction.user.id);
    if (previousEntry !== null) {
      const mojangUUIDLookup = await uuidToUsername(previousEntry.mcUUID);
      if (mojangUUIDLookup.webError) {
        throw new Error(mojangUUIDLookup.webError);
      }
      if (!mojangUUIDLookup.error) {
        interaction.editReply(`You've already whitelisted an account with username ${bold(mojangUUIDLookup.name)}!\nPlease use ${inlineCode("/unwhitelist")} before attempting to whitelist a new account.`);
        return;
      }
    }

    // Double-check account exists
    const mojangData = await usernameToUUID(username);
    if (mojangData.error) {
      interaction.editReply(mojangData.error);
      return;
    }
    // If Mojang API call fails, let user know
    if (mojangData.webError) {
      interaction.editReply(`Mojang authentication failed: ${mojangData.webError}`);
      return;
    }


    // Put in a request for whitelisting
    const pterodactylData = await whitelistUser(username, pterodactylServerIdentifier);
    if (pterodactylData.error) {
      interaction.editReply(`Request to server failed: ${pterodactylData.error}`);
      return;
    }

    await WhitelistEntry.create({
      discordId:    interaction.user.id,
      mcUUID:       mojangData.id,
    });
    interaction.editReply(`${bold(username)} has been whitelisted!\n\nPlease be aware that you ${bold("DO NOT")} need to re-whitelist if you change your username. Minecraft uses your account ID to whitelist you, so you'll still have access even after a name change.`);
  },
};
