"""
Database placeholder - to be implemented with SQLAlchemy models
"""


class Database:
    """Placeholder database class - will be replaced with SQLAlchemy implementation"""

    def __init__(self):
        pass

    # User management
    def get_user(self, discord_id: str):
        """Get user by Discord ID"""
        raise NotImplementedError

    def create_user(self, discord_id: str, username: str):
        """Create a new user"""
        raise NotImplementedError

    def get_or_create_user(self, discord_id: str, username: str):
        """Get existing user or create new one"""
        raise NotImplementedError

    # Social accounts
    def add_social_account(self, discord_id: str, platform: str, handle: str):
        """Add a social media account and generate verification code"""
        raise NotImplementedError

    def verify_account(self, discord_id: str, platform: str):
        """Mark account as verified"""
        raise NotImplementedError

    def remove_account(self, discord_id: str, platform: str, username: str):
        """Remove a social media account"""
        raise NotImplementedError

    def get_verification_status(self, discord_id: str, platform: str, username: str):
        """Check verification status of an account"""
        raise NotImplementedError

    def get_account_info(self, discord_id: str):
        """Get all account info for a user"""
        raise NotImplementedError

    # Clips/Uploads
    def submit_clip(self, discord_id: str, url: str, is_bounty: bool = False, tag: str = None):
        """Submit a video clip"""
        raise NotImplementedError

    def submit_clips(self, discord_id: str, urls: list, is_bounty: bool = False, tag: str = None):
        """Submit multiple video clips"""
        raise NotImplementedError

    def update_clip_stats(self, clip_id: int, views: int, likes: int, comments: int):
        """Update stats for a clip"""
        raise NotImplementedError

    def get_user_clips(self, discord_id: str):
        """Get all clips for a user"""
        raise NotImplementedError

    # Payment methods
    def add_paypal(self, discord_id: str, email: str, first_name: str, last_name: str):
        """Add PayPal payment method"""
        raise NotImplementedError

    def add_usdc(self, discord_id: str, wallet_address: str):
        """Add USDC wallet"""
        raise NotImplementedError

    def add_sol_usdc(self, discord_id: str, wallet_address: str):
        """Add Solana USDC wallet"""
        raise NotImplementedError

    def get_payment_methods(self, discord_id: str):
        """Get all payment methods for a user"""
        raise NotImplementedError

    def remove_payment_method(self, discord_id: str, platform: str):
        """Remove a payment method"""
        raise NotImplementedError

    def get_payment_details(self, discord_id: str):
        """Get payment details for a user"""
        raise NotImplementedError

    # Stats & Leaderboard
    def get_user_stats(self, discord_id: str):
        """Get stats for a specific user"""
        raise NotImplementedError

    def get_leaderboard(self, limit: int = 10):
        """Get top users by views"""
        raise NotImplementedError


# Global database instance
db = Database()