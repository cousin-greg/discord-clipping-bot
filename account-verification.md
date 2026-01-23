# Account Verification System

## Overview

Link and verify social media accounts to Discord users. Verification ensures the Discord user owns the social account they're claiming.

## Commands

### /add-account [platform] [username]
Initiate linking a social media account.

**Parameters:**
- platform: Social platform (youtube, tiktok, twitter, etc.)
- username: Username/handle on that platform

**Behavior:**
1. Generate unique verification code
2. Instruct user to add code to their social bio
3. Store pending verification with code and expiry
4. User must run /verify-status to complete

### /verify-status [platform] [username]
Check verification status and complete verification.

**Parameters:**
- platform: Social platform
- username: Username on platform

**Behavior:**
1. Fetch user's bio from platform API
2. Check if verification code is present
3. If found: mark account as verified, link to Discord user
4. If not found: inform user code not detected

### /remove-account [platform] [username]
Unlink a verified social account.

**Parameters:**
- platform: Social platform
- username: Username to remove

**Behavior:**
- Remove link between Discord user and social account
- Videos from that account remain but may be orphaned

### /account-info
Display all linked accounts and their verification status.

**Output:**
- List of all added accounts
- Verification status for each (pending/verified)
- Platform and username for each

## Verification Flow

1. User runs /add-account youtube "MyChannel"
2. Bot responds: "Add code XYZ123 to your YouTube bio, then run /verify-status"
3. User adds code to bio
4. User runs /verify-status youtube "MyChannel"
5. Bot checks bio, finds code, marks verified
6. User can now upload videos from that account

## Data Model

LinkedAccount:
- id
- discord_user_id
- platform
- platform_username
- verification_code
- verification_status (pending/verified)
- verified_at
- created_at

## Acceptance Criteria

- Verification codes are unique and expire after 24h
- Bio check accurately detects code presence
- User can have multiple accounts per platform
- Only verified accounts can have videos tracked
- /account-info shows complete account status
