# Stats & Leaderboard System

## Overview

Track and display aggregate statistics for clippers based on their uploaded video performance.

## Commands

### /stats
Displays the requesting user's personal statistics.

**Output:**
- Total views across all tracked videos
- Total comments across all tracked videos
- Total likes across all tracked videos
- Number of videos uploaded

### /leaderboard
Displays a leaderboard of top clippers.

**Output:**
- Ranked list of users sorted by total views
- Shows username, total views, total comments, total likes
- Paginated (10 per page recommended)

## Data Requirements

- Aggregate stats per user (views, comments, likes)
- Stats should update when video tracking data refreshes
- Historical tracking optional for v1

## Acceptance Criteria

- /stats returns accurate totals for the requesting user
- /leaderboard shows top performers sorted by views descending
- Stats reflect current tracked video data (not stale)
- Handle users with no uploads gracefully
