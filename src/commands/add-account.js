const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-account')
    .setDescription('Add a social account to be tracked by the bot')
    .addStringOption(option =>
      option.setName('platform')
        .setDescription('The platform (e.g., YouTube, Twitch, TikTok)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Your username on that platform')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const platform = interaction.options.getString('platform');
    const username = interaction.options.getString('username');

    let user = db.getUser(userId);
    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    // Generate verification code
    const verificationCode = db.generateVerificationCode(userId);

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Account Added - Verification Required')
      .setDescription(`Your ${platform} account has been added. Please verify your account to continue.`)
      .addFields(
        { name: 'Platform', value: platform, inline: true },
        { name: 'Username', value: username, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Verification Code', value: `\`${verificationCode}\`` },
        { name: 'Next Step', value: `Please put this verification code in your ${platform} account bio and then use the \`/verify-account\` command with the code.` }
      )
      .setTimestamp();

    // Store account info temporarily
    db.setAccountInfo(userId, platform, username);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
