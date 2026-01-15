# Discord Clipping Bot

A Discord bot for managing a video clipping platform. Users can upload video links, verify their social accounts, manage payment methods, and track statistics.

## Features

### User Management
- **Stats**: View personal and global statistics
- **Dashboard**: Personal dashboard with account overview

### Video Upload
- **Upload Links**: Submit video links to be tracked by the bot
- Tracks view count, comments, and likes

### Account Verification
- **Add Account**: Connect social media accounts (YouTube, Twitch, TikTok, etc.)
- **Verify Account**: Verify ownership using a verification code in your bio
- **Account Info**: View connected account details

### Payment Methods
- **PayPal**: Add PayPal email for payments
- **USDC**: Add USDC wallet addresses
- **Solana USDC**: Add Solana USDC wallet addresses
- **Manage**: View and remove payment methods

## Commands

| Command | Description |
|---------|-------------|
| `/stats` | View your stats and global statistics |
| `/dashboard` | View your personal dashboard |
| `/upload <link>` | Upload a video link to the bot |
| `/add-account <platform> <username>` | Add a social account to track |
| `/verify-account <code>` | Verify your account with the code |
| `/account-info` | View details about your connected account |
| `/add-paypal <email>` | Add PayPal as a payment method |
| `/add-usdc <wallet>` | Add USDC wallet address |
| `/add-sol-usdc <wallet>` | Add Solana USDC wallet address |
| `/payment-methods` | View all your payment methods |
| `/remove-payment-method <index>` | Remove a payment method |
| `/payment-details` | Show all your payment details |
| `/remove-payment-details <index>` | Remove a payment detail |

## Setup Instructions

### Prerequisites
- Node.js 16.9.0 or higher
- A Discord account
- Discord Developer Application

### Step 1: Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section
4. Click "Add Bot"
5. Under "Privileged Gateway Intents", enable:
   - Server Members Intent (optional)
   - Message Content Intent (optional)
6. Click "Reset Token" and copy your bot token (keep this secret!)

### Step 2: Get Your Client ID and Guild ID

1. In the Discord Developer Portal, go to "OAuth2" > "General"
2. Copy your "Client ID"
3. To get your Guild (Server) ID:
   - Open Discord
   - Enable Developer Mode: User Settings > Advanced > Developer Mode
   - Right-click your server and select "Copy Server ID"

### Step 3: Invite the Bot to Your Server

1. In the Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select these scopes:
   - `bot`
   - `applications.commands`
3. Select these bot permissions:
   - Send Messages
   - Embed Links
   - Read Message History
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### Step 4: Install Dependencies

```bash
cd discord-clipping-bot
npm install
```

### Step 5: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### Step 6: Deploy Commands

Deploy the slash commands to your Discord server:

```bash
node src/deploy-commands.js
```

You should see output like:
```
[INFO] Loaded command: stats
[INFO] Loaded command: dashboard
...
[SUCCESS] Successfully reloaded 13 guild (/) commands.
```

### Step 7: Start the Bot

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

You should see:
```
[INFO] Loaded command: stats
[INFO] Loaded command: dashboard
...
[SUCCESS] Logged in as YourBotName#1234!
[INFO] Bot is ready and serving 1 servers
```

## Usage Example

1. In your Discord server, use `/add-account` to connect your social media account
2. Put the verification code in your social media bio
3. Use `/verify-account` with the code to verify
4. Use `/upload` to submit video links
5. Use `/add-paypal` or `/add-usdc` to add payment methods
6. Use `/stats` to view your statistics
7. Use `/dashboard` to see your overview

## Project Structure

```
discord-clipping-bot/
├── src/
│   ├── commands/          # All bot commands
│   │   ├── stats.js
│   │   ├── dashboard.js
│   │   ├── upload.js
│   │   ├── add-account.js
│   │   ├── verify-account.js
│   │   ├── account-info.js
│   │   ├── add-paypal.js
│   │   ├── add-usdc.js
│   │   ├── add-sol-usdc.js
│   │   ├── payment-methods.js
│   │   ├── remove-payment-method.js
│   │   ├── payment-details.js
│   │   └── remove-payment-details.js
│   ├── config.js          # Configuration loader
│   ├── database.js        # In-memory database
│   ├── deploy-commands.js # Command deployment script
│   └── index.js           # Main bot file
├── .env                   # Environment variables (create this)
├── .env.example          # Example environment file
├── .gitignore
├── package.json
└── README.md
```

## Database

Currently uses an in-memory database for simplicity. Data will be lost when the bot restarts. For production use, consider integrating:
- MongoDB
- PostgreSQL
- SQLite
- JSON file storage

## Development

To add a new command:

1. Create a new file in `src/commands/` (e.g., `my-command.js`)
2. Use this template:

```javascript
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-command')
    .setDescription('Description of my command'),
  async execute(interaction) {
    // Your command logic here
    await interaction.reply('Hello!');
  },
};
```

3. Restart the bot and redeploy commands:
```bash
node src/deploy-commands.js
npm start
```

## Troubleshooting

### Commands not showing up
- Make sure you ran `node src/deploy-commands.js`
- Wait a few minutes for Discord to register the commands
- Try restarting Discord

### Bot not responding
- Check that the bot is online in your server
- Verify your token is correct in `.env`
- Check console for error messages

### Permission errors
- Ensure the bot has proper permissions in your server
- Check the bot role is not below other roles that might restrict it

## License

ISC

## Support

For issues or questions, please check the console logs for error messages.
