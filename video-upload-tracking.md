# Video Upload & Tracking System

## Overview

Allow clippers to submit video links for tracking. Bot monitors view count, comment count, and like count over time.

## Commands

### /upload [link]
Upload a single video link to be tracked.

**Parameters:**
- link: URL to the video (YouTube, TikTok, etc.)

**Behavior:**
- Validate URL format
- Extract initial metrics (views, comments, likes)
- Associate video with user's account
- Confirm successful upload

### /upload [link1,link2,link3]
Upload multiple video links at once.

**Parameters:**
- Comma-separated list of URLs

**Behavior:**
- Process each link individually
- Report success/failure for each
- Batch insert to database

## Tracking Behavior

- Bot periodically polls video platforms for updated metrics
- Polling interval: configurable (recommend every 30-60 min)
- Store historical snapshots for growth analysis (optional v1)

## Supported Platforms (v1)

- YouTube
- TikTok
- (Extensible for future platforms)

## Data Model

Video:
- id
- user_id (discord user)
- platform
- platform_video_id
- url
- current_views
- current_comments
- current_likes
- created_at
- last_updated

## Acceptance Criteria

- Single upload creates tracked video entry
- Multi-upload handles comma-separated links
- Invalid URLs rejected with clear error message
- Metrics fetched on upload and stored
- User can only see their own uploads
