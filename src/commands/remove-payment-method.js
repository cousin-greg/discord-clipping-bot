const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-payment-method')
    .setDescription('Remove a payment method')
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The number of the payment method to remove (use /payment-methods to see the list)')
        .setRequired(true)
        .setMinValue(1)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const index = interaction.options.getInteger('index') - 1; // Convert to 0-based index

    const user = db.getUser(userId);
    if (!user || user.paymentMethods.length === 0) {
      await interaction.reply({ content: 'You don\'t have any payment methods to remove.', ephemeral: true });
      return;
    }

    if (index < 0 || index >= user.paymentMethods.length) {
      await interaction.reply({ content: 'Invalid payment method number. Use `/payment-methods` to see your list.', ephemeral: true });
      return;
    }

    const removedMethod = user.paymentMethods[index];
    const removed = db.removePaymentMethod(userId, index);

    if (removed) {
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Payment Method Removed')
        .setDescription(`Successfully removed ${removedMethod.method.toUpperCase()} payment method.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ content: 'Failed to remove payment method.', ephemeral: true });
    }
  },
};
