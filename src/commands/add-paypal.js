const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-paypal')
    .setDescription('Add PayPal as a payment method')
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Your PayPal email address')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const email = interaction.options.getString('email');

    let user = db.getUser(userId);
    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      await interaction.reply({ content: 'Please provide a valid email address.', ephemeral: true });
      return;
    }

    const methodIndex = db.addPaymentMethod(userId, 'paypal');
    db.setPaypalEmail(userId, methodIndex, email);

    const embed = new EmbedBuilder()
      .setColor(0x0070BA)
      .setTitle('PayPal Added Successfully')
      .setDescription('Your PayPal account has been added as a payment method.')
      .addFields(
        { name: 'Email', value: email },
        { name: 'Total Payment Methods', value: `${user.paymentMethods.length + 1}` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
