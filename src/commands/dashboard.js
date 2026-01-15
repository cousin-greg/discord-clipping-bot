const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('View your personal dashboard'),
  async execute(interaction) {
    const userId = interaction.user.id;
    let user = db.getUser(userId);

    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle(`Dashboard for ${interaction.user.username}`)
      .addFields(
        { name: 'Account Status', value: user.accountVerified ? 'Verified ✓' : 'Not Verified ✗', inline: true },
        { name: 'Upload Links', value: `${user.uploadLinks.length} links`, inline: true },
        { name: 'Payment Methods', value: `${user.paymentMethods.length} methods`, inline: true }
      );

    if (user.accountInfo) {
      embed.addFields({
        name: 'Connected Account',
        value: `Platform: ${user.accountInfo.platform}\nUsername: ${user.accountInfo.username}`,
        inline: false
      });
    }

    if (user.uploadLinks.length > 0) {
      const recentLinks = user.uploadLinks.slice(-3).map((l, i) => `${i + 1}. ${l.link}`).join('\n');
      embed.addFields({
        name: 'Recent Upload Links',
        value: recentLinks || 'None',
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
