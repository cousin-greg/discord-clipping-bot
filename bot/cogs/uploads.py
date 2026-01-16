import discord
from discord.ext import commands
from discord import app_commands
from typing import Optional

from database import db


class UploadsCog(commands.Cog):
    """Commands for uploading and managing clips"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="upload", description="Upload video link(s) to be tracked")
    @app_commands.describe(
        link1="First video link",
        link2="Second video link (optional)",
        link3="Third video link (optional)"
    )
    async def upload(
        self,
        interaction: discord.Interaction,
        link1: str,
        link2: Optional[str] = None,
        link3: Optional[str] = None
    ):
        """
        /upload [link1, link2, link3] - Upload video link(s) to the bot
        Bot tracks the video's view count, comment count, and like count
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        # Ensure user exists
        db.get_or_create_user(user_id, username)

        # Collect all provided links
        links = [link for link in [link1, link2, link3] if link]

        # Submit clips
        results = db.submit_clips(user_id, links, is_bounty=False)

        embed = discord.Embed(
            title="📤 Clips Uploaded",
            color=discord.Color.green()
        )

        for link in links:
            embed.add_field(name="Link", value=link, inline=False)

        embed.set_footer(text=f"Total clips submitted: {len(links)}")

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="bounty-upload", description="Upload video link(s) for a bounty/campaign")
    @app_commands.describe(
        tag="Campaign or bounty tag",
        link1="First video link",
        link2="Second video link (optional)",
        link3="Third video link (optional)"
    )
    async def bounty_upload(
        self,
        interaction: discord.Interaction,
        tag: str,
        link1: str,
        link2: Optional[str] = None,
        link3: Optional[str] = None
    ):
        """
        /bounty-upload [link] [tag] - Same as /upload but stores details for special campaigns
        This is for special campaigns
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        # Ensure user exists
        db.get_or_create_user(user_id, username)

        # Collect all provided links
        links = [link for link in [link1, link2, link3] if link]

        # Submit clips with bounty flag
        results = db.submit_clips(user_id, links, is_bounty=True, tag=tag)

        embed = discord.Embed(
            title="🎯 Bounty Clips Uploaded",
            description=f"Campaign: **{tag}**",
            color=discord.Color.purple()
        )

        for link in links:
            embed.add_field(name="Link", value=link, inline=False)

        embed.set_footer(text=f"Total bounty clips submitted: {len(links)}")

        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(UploadsCog(bot))