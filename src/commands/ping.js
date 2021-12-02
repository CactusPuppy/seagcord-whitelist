const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot and get some statistics."),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
      ephemeral: true,
    });
    interaction.editReply(`${bold("Pong!")} | RTT: ${bold((sent.createdTimestamp - interaction.createdTimestamp).toString())}ms | Heartbeat: ${bold((interaction.client.ws.ping).toString())}ms`);
  },
};
