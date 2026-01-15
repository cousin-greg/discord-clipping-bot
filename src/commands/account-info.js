const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('account-info')
    .setDescription('View details about your connected account'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = db.getUser(userId);

    if (!user || !user.accountInfo) {
      await interaction.reply({ content: 'You haven\'t added an account yet. Use `/add-account` to get started.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Account Information')
      .addFields(
        { name: 'Platform', value: user.accountInfo.platform, inline: true },
        { name: 'Username', value: user.accountInfo.username, inline: true },
        { name: 'Verified', value: user.accountVerified ? 'Yes ✓' : 'No ✗', inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
