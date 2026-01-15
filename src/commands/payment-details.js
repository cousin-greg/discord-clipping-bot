const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment-details')
    .setDescription('Show all your payment details (wallet addresses)'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = db.getUser(userId);

    if (!user || user.paymentDetails.length === 0) {
      await interaction.reply({
        content: 'You haven\'t added any payment details yet. Use `/add-usdc` or `/add-sol-usdc` to add wallet addresses.',
        ephemeral: true
      });
      return;
    }

    const detailsList = user.paymentDetails.map((detail, index) => {
      return `${index + 1}. \`${detail.walletAddress}\``;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Your Payment Details')
      .setDescription(detailsList || 'No payment details found')
      .setFooter({ text: 'Use /remove-payment-details to remove a wallet' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
