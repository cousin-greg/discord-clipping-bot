import discord
from discord.ext import commands
from discord import app_commands
from typing import Literal

from database import db

# Platform choices based on flowchart
PlatformType = Literal["TikTok", "Instagram", "YouTube"]


class AccountsCog(commands.Cog):
    """Commands for managing social media accounts"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="add-account", description="Add a social media account to be tracked")
    @app_commands.describe(
        platform="Social media platform",
        username="Your username on that platform"
    )
    async def add_account(
        self,
        interaction: discord.Interaction,
        platform: PlatformType,
        username: str
    ):
        """
        /add-account [platform] [username] - Adds a social media account to be tracked by the bot
        User must put a verification code in their account bio
        """
        user_id = str(interaction.user.id)
        discord_username = interaction.user.name

        # Ensure user exists
        db.get_or_create_user(user_id, discord_username)

        # Add account and get verification code
        result = db.add_social_account(user_id, platform, username)
        verification_code = result.get("verification_code")

        embed = discord.Embed(
            title="🔗 Account Added",
            description=f"Added **{platform}** account: `{username}`",
            color=discord.Color.blue()
        )

        embed.add_field(
            name="⚠️ Verification Required",
            value=f"Add this code to your {platform} bio:\n```{verification_code}```",
            inline=False
        )

        embed.add_field(
            name="Next Step",
            value=f"After adding the code, use `/verify-status {platform} {username}` to verify",
            inline=False
        )

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="verify-status", description="Check verification status of your account")
    @app_commands.describe(
        platform="Social media platform",
        username="Your username on that platform"
    )
    async def verify_status(
        self,
        interaction: discord.Interaction,
        platform: PlatformType,
        username: str
    ):
        """
        /verify-status [platform] [username] - Checks verification status of the account you added
        """
        user_id = str(interaction.user.id)

        status = db.get_verification_status(user_id, platform, username)

        if status is None:
            await interaction.response.send_message(
                f"❌ No account found for {platform}: `{username}`",
                ephemeral=True
            )
            return

        if status.get("is_verified"):
            embed = discord.Embed(
                title="✅ Account Verified",
                description=f"**{platform}**: `{username}` is verified!",
                color=discord.Color.green()
            )
        else:
            embed = discord.Embed(
                title="⏳ Pending Verification",
                description=f"**{platform}**: `{username}` is not yet verified",
                color=discord.Color.yellow()
            )
            embed.add_field(
                name="Verification Code",
                value=f"```{status.get('verification_code')}```",
                inline=False
            )
            embed.add_field(
                name="Instructions",
                value=f"Add the code above to your {platform} bio, then check again",
                inline=False
            )

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="remove-account", description="Remove a social media account")
    @app_commands.describe(
        platform="Social media platform",
        username="Your username on that platform"
    )
    async def remove_account(
        self,
        interaction: discord.Interaction,
        platform: PlatformType,
        username: str
    ):
        """
        /remove-account [platform] [username] - Removes a social media account from the user's profile
        Account is no longer tracked
        """
        user_id = str(interaction.user.id)

        success = db.remove_account(user_id, platform, username)

        if success:
            embed = discord.Embed(
                title="🗑️ Account Removed",
                description=f"Removed **{platform}** account: `{username}`",
                color=discord.Color.red()
            )
            embed.add_field(
                name="Note",
                value="This account will no longer be tracked",
                inline=False
            )
        else:
            embed = discord.Embed(
                title="❌ Error",
                description=f"Could not find account: {platform} - `{username}`",
                color=discord.Color.red()
            )

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="account-info", description="View all your linked accounts")
    async def account_info(self, interaction: discord.Interaction):
        """
        /account-info - View all details about account
        """
        user_id = str(interaction.user.id)
        discord_username = interaction.user.name

        db.get_or_create_user(user_id, discord_username)

        info = db.get_account_info(user_id)

        embed = discord.Embed(
            title="👤 Account Info",
            description=f"Linked accounts for **{discord_username}**",
            color=discord.Color.blue()
        )

        accounts = info.get("accounts", [])
        if not accounts:
            embed.add_field(
                name="No Accounts Linked",
                value="Use `/add-account` to link a social media account",
                inline=False
            )
        else:
            for account in accounts:
                status = "✅ Verified" if account.get("is_verified") else "⏳ Pending"
                embed.add_field(
                    name=f"{account['platform']}",
                    value=f"**Handle:** {account['handle']}\n**Status:** {status}",
                    inline=True
                )

        await interaction.response.send_message(embed=embed, ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(AccountsCog(bot))