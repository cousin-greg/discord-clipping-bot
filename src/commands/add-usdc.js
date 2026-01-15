const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-usdc')
    .setDescription('Add USDC wallet as a payment method')
    .addStringOption(option =>
      option.setName('wallet')
        .setDescription('Your USDC wallet address')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const wallet = interaction.options.getString('wallet');

    let user = db.getUser(userId);
    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    db.addPaymentDetail(userId, wallet);

    const embed = new EmbedBuilder()
      .setColor(0x2775CA)
      .setTitle('USDC Wallet Added Successfully')
      .setDescription('Your USDC wallet has been added as a payment method.')
      .addFields(
        { name: 'Wallet Address', value: `\`${wallet}\`` },
        { name: 'All Payment Details', value: 'Use `/payment-details` to view all your saved payment details' }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
