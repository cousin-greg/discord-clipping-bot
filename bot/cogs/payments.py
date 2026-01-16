import discord
from discord.ext import commands
from discord import app_commands
from typing import Literal

from database import db

# Payment platform types based on flowchart
PaymentPlatformType = Literal["PayPal", "USDC", "SOL-USDC"]


class PaymentsCog(commands.Cog):
    """Commands for managing payment methods"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="add-paypal", description="Add PayPal as a payment method")
    @app_commands.describe(
        email="Your PayPal email address",
        first_name="Your first name",
        last_name="Your last name"
    )
    async def add_paypal(
        self,
        interaction: discord.Interaction,
        email: str,
        first_name: str,
        last_name: str
    ):
        """
        /add-paypal [paypal email] [first name] [last name] - Add PayPal payment method
        Stores user's payment details
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        db.get_or_create_user(user_id, username)

        result = db.add_paypal(user_id, email, first_name, last_name)

        embed = discord.Embed(
            title="💳 PayPal Added",
            color=discord.Color.blue()
        )
        embed.add_field(name="Email", value=email, inline=True)
        embed.add_field(name="Name", value=f"{first_name} {last_name}", inline=True)

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="add-usdc", description="Add USDC wallet address")
    @app_commands.describe(wallet_address="Your USDC wallet address (ERC-20)")
    async def add_usdc(
        self,
        interaction: discord.Interaction,
        wallet_address: str
    ):
        """
        /add-usdc [wallet address] - Add USDC wallet for payments
        Stores user's payment details
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        db.get_or_create_user(user_id, username)

        result = db.add_usdc(user_id, wallet_address)

        embed = discord.Embed(
            title="💰 USDC Wallet Added",
            color=discord.Color.green()
        )
        embed.add_field(name="Wallet Address", value=f"`{wallet_address}`", inline=False)
        embed.add_field(name="Network", value="ERC-20 (Ethereum)", inline=True)

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="add-sol-usdc", description="Add Solana USDC wallet address")
    @app_commands.describe(wallet_address="Your Solana wallet address for USDC")
    async def add_sol_usdc(
        self,
        interaction: discord.Interaction,
        wallet_address: str
    ):
        """
        /add-sol-usdc [wallet address] - Add Solana USDC wallet for payments
        Stores user's payment details
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        db.get_or_create_user(user_id, username)

        result = db.add_sol_usdc(user_id, wallet_address)

        embed = discord.Embed(
            title="💰 Solana USDC Wallet Added",
            color=discord.Color.purple()
        )
        embed.add_field(name="Wallet Address", value=f"`{wallet_address}`", inline=False)
        embed.add_field(name="Network", value="Solana (SPL)", inline=True)

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="payment-methods", description="View all your payment methods")
    async def payment_methods(self, interaction: discord.Interaction):
        """
        /payment-methods - View all payment methods for user
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        db.get_or_create_user(user_id, username)

        methods = db.get_payment_methods(user_id)

        embed = discord.Embed(
            title="💳 Your Payment Methods",
            color=discord.Color.blue()
        )

        if not methods:
            embed.description = "No payment methods added yet.\nUse `/add-paypal`, `/add-usdc`, or `/add-sol-usdc` to add one."
        else:
            for method in methods:
                method_type = method.get("method_type")
                if method_type == "PayPal":
                    embed.add_field(
                        name="PayPal",
                        value=f"**Email:** {method.get('email')}\n**Name:** {method.get('name')}",
                        inline=False
                    )
                elif method_type == "USDC":
                    embed.add_field(
                        name="USDC (ERC-20)",
                        value=f"**Address:** `{method.get('address')}`",
                        inline=False
                    )
                elif method_type == "SOL-USDC":
                    embed.add_field(
                        name="USDC (Solana)",
                        value=f"**Address:** `{method.get('address')}`",
                        inline=False
                    )

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="remove-payment-method", description="Remove a payment method")
    @app_commands.describe(platform="Payment platform to remove")
    async def remove_payment_method(
        self,
        interaction: discord.Interaction,
        platform: PaymentPlatformType
    ):
        """
        /remove-payment-details [platform] - Remove user's specified payment detail(s)
        """
        user_id = str(interaction.user.id)

        success = db.remove_payment_method(user_id, platform)

        if success:
            embed = discord.Embed(
                title="🗑️ Payment Method Removed",
                description=f"Removed **{platform}** payment method",
                color=discord.Color.red()
            )
        else:
            embed = discord.Embed(
                title="❌ Error",
                description=f"No {platform} payment method found",
                color=discord.Color.red()
            )

        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="payment-details", description="View detailed payment information")
    async def payment_details(self, interaction: discord.Interaction):
        """
        /payment-details - Shows all user's payment detail(s)
        """
        user_id = str(interaction.user.id)
        username = interaction.user.name

        db.get_or_create_user(user_id, username)

        details = db.get_payment_details(user_id)

        embed = discord.Embed(
            title="📋 Payment Details",
            color=discord.Color.gold()
        )

        if not details:
            embed.description = "No payment details on file."
        else:
            # PayPal details
            if details.get("paypal"):
                pp = details["paypal"]
                embed.add_field(
                    name="💳 PayPal",
                    value=f"**Email:** {pp.get('email')}\n**Name:** {pp.get('first_name')} {pp.get('last_name')}",
                    inline=False
                )

            # Crypto wallets
            if details.get("wallets"):
                for wallet in details["wallets"]:
                    network = "ERC-20" if wallet["type"] == "USDC" else "Solana"
                    embed.add_field(
                        name=f"💰 {wallet['type']}",
                        value=f"**Network:** {network}\n**Address:** `{wallet['address']}`",
                        inline=False
                    )

        await interaction.response.send_message(embed=embed, ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(PaymentsCog(bot))