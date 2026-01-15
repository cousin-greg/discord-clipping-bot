const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-payment-details')
    .setDescription('Remove a payment detail (wallet address)')
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The number of the payment detail to remove (use /payment-details to see the list)')
        .setRequired(true)
        .setMinValue(1)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const index = interaction.options.getInteger('index') - 1; // Convert to 0-based index

    const user = db.getUser(userId);
    if (!user || user.paymentDetails.length === 0) {
      await interaction.reply({ content: 'You don\'t have any payment details to remove.', ephemeral: true });
      return;
    }

    if (index < 0 || index >= user.paymentDetails.length) {
      await interaction.reply({ content: 'Invalid payment detail number. Use `/payment-details` to see your list.', ephemeral: true });
      return;
    }

    const removedDetail = user.paymentDetails[index];
    const removed = db.removePaymentDetail(userId, index);

    if (removed) {
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Payment Detail Removed')
        .setDescription(`Successfully removed wallet: \`${removedDetail.walletAddress}\``)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ content: 'Failed to remove payment detail.', ephemeral: true });
    }
  },
};
