const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-account')
    .setDescription('Verify your account with the code')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The verification code from your account bio')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const code = interaction.options.getString('code').toUpperCase();

    const user = db.getUser(userId);
    if (!user) {
      await interaction.reply({ content: 'Please use `/add-account` first to add your account.', ephemeral: true });
      return;
    }

    const verified = db.verifyAccount(userId, code);

    if (verified) {
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Account Verified Successfully!')
        .setDescription('Your account has been verified and is now being tracked by the bot.')
        .addFields(
          { name: 'Platform', value: user.accountInfo.platform, inline: true },
          { name: 'Username', value: user.accountInfo.username, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({
        content: 'Invalid verification code. Please make sure you entered the correct code from your account bio.',
        ephemeral: true
      });
    }
  },
};
