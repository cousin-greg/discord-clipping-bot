const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your stats or top users'),
  async execute(interaction) {
    const userId = interaction.user.id;
    let user = db.getUser(userId);

    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    const userStats = db.getUserStats(userId);
    const globalStats = db.getStats();

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle(`Stats for ${interaction.user.username}`)
      .addFields(
        { name: 'Uploaded Videos', value: `${userStats.uploadedVideos}`, inline: true },
        { name: 'Account Verified', value: userStats.accountVerified ? 'Yes' : 'No', inline: true },
        { name: 'Payment Methods', value: `${userStats.paymentMethodsCount}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Global Stats', value: '\u200B' },
        { name: 'Total Views', value: `${globalStats.totalViews}`, inline: true },
        { name: 'Total Comments', value: `${globalStats.totalComments}`, inline: true },
        { name: 'Total Likes', value: `${globalStats.totalLikes}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
