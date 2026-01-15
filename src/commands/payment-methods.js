const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment-methods')
    .setDescription('View all your payment methods'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = db.getUser(userId);

    if (!user || user.paymentMethods.length === 0) {
      await interaction.reply({
        content: 'You haven\'t added any payment methods yet. Use `/add-paypal` to add PayPal.',
        ephemeral: true
      });
      return;
    }

    const methodsList = user.paymentMethods.map((method, index) => {
      let display = `${index + 1}. **${method.method.toUpperCase()}**`;
      if (method.email) {
        display += ` - ${method.email}`;
      }
      return display;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Your Payment Methods')
      .setDescription(methodsList || 'No payment methods found')
      .setFooter({ text: 'Use /remove-payment-method to remove a method' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
