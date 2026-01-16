import discord
from discord.ext import commands
from discord import app_commands

from database import db


class StatsCog(commands.Cog):
    """Commands for viewing stats and leaderboard"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="stats", description="View your personal stats")
    async def stats(self, interaction: discord.Interaction):
        """
        /stats - Tracks user stats
        Shows total views, comments, and likes their videos have gotten
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        # Ensure user exists
        db.get_or_create_user(user_id, username)

        stats = db.get_user_stats(user_id)

        embed = discord.Embed(
            title="📊 Your Stats",
            color=discord.Color.blue()
        )
        embed.add_field(name="Total Views", value=stats.get("total_views", 0), inline=True)
        embed.add_field(name="Total Comments", value=stats.get("total_comments", 0), inline=True)
        embed.add_field(name="Total Likes", value=stats.get("total_likes", 0), inline=True)
        embed.add_field(name="Clips Uploaded", value=stats.get("clip_count", 0), inline=True)
        embed.add_field(name="Unpaid Views", value=stats.get("unpaid_views", 0), inline=True)
        embed.add_field(name="Paid Views", value=stats.get("paid_views", 0), inline=True)

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="leaderboard", description="View the top clippers by views")
    @app_commands.describe(limit="Number of users to show (default: 10)")
    async def leaderboard(self, interaction: discord.Interaction, limit: int = 10):
        """
        /leaderboard - Pulls up a leaderboard that shows users with top views, comments, and likes
        """
        leaderboard_data = db.get_leaderboard(limit=min(limit, 25))

        embed = discord.Embed(
            title="🏆 Leaderboard - Top Clippers",
            description="Ranked by total unpaid views",
            color=discord.Color.gold()
        )

        if not leaderboard_data:
            embed.description = "No data yet. Start uploading clips!"
        else:
            for i, entry in enumerate(leaderboard_data, 1):
                medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
                embed.add_field(
                    name=f"{medal} {entry['username']}",
                    value=f"Views: {entry['total_unpaid_views']:,}",
                    inline=False
                )

        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(StatsCog(bot))