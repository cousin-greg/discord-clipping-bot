# Bounty & Campaign System

## Overview

Special campaigns where videos are tagged for specific promotions or bounties. Allows tracking videos by campaign for reporting and payouts.

## Commands

### /bounty-upload [link] [tag]
Upload a single video linked to a specific campaign/bounty.

**Parameters:**
- link: URL to the video
- tag: Campaign identifier (e.g., "january-promo", "packrush-launch")

**Behavior:**
- Same as /upload but associates video with campaign tag
- Video appears in both user's uploads and campaign tracking

### /bounty-upload [link1,link2,link3]
Upload multiple videos for a bounty campaign.

**Parameters:**
- Comma-separated list of URLs
- Note: Tag may need to be specified separately or as additional param

**Behavior:**
- Batch upload with campaign association
- All videos tagged to same campaign

## Campaign Management (Admin)

Future consideration:
- Create/manage campaigns
- Set campaign date ranges
- Campaign-specific leaderboards
- Payout calculations per campaign

## Data Model

Campaign:
- id
- tag (unique identifier)
- name
- description
- start_date
- end_date
- active

VideoTag:
- video_id
- campaign_id

## Acceptance Criteria

- Bounty uploads are tagged with campaign identifier
- Videos can be queried by campaign tag
- Same video can belong to multiple campaigns
- Campaign tag validation (must exist or auto-create)
