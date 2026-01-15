const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload a video link to the bot')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('The video link to upload')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.user.id;
    const link = interaction.options.getString('link');

    let user = db.getUser(userId);
    if (!user) {
      user = db.createUser(userId, interaction.user.username);
    }

    // Basic link validation
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      await interaction.reply({ content: 'Please provide a valid URL starting with http:// or https://', ephemeral: true });
      return;
    }

    db.addUploadLink(userId, link);

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Video Link Uploaded')
      .setDescription(`Your link has been added to the bot!`)
      .addFields(
        { name: 'Link', value: link },
        { name: 'Total Links', value: `${user.uploadLinks.length}` }
      )
      .setFooter({ text: 'Bot tracks the video\'s view count, comments, and like count' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
