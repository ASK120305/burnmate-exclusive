# User-Specific Data Implementation

This document explains how user-specific data separation has been implemented in the Burn Buddy Blitz project to ensure each user has separate data for calories burned and related stats.

## Overview

The application now implements proper user data separation where:
- Each user's activities, calories burned, and leaderboard entries are stored separately
- Data is associated with a unique user ID
- Users can only access and modify their own data
- Data is properly cleared when users log out

## Key Changes Made

### 1. Updated BurnContext (`src/context/BurnContext.tsx`)

- **Added `userId` field** to `Activity` and `LeaderboardEntry` interfaces
- **User-specific data loading**: Data is now loaded from `localStorage` using user-specific keys (`burnmate-activities-${userId}`, `burnmate-leaderboard-${userId}`)
- **User-specific data saving**: Data is saved to user-specific localStorage keys
- **User validation**: All data operations now require a logged-in user
- **Data clearing**: Added `clearUserData()` function to clear user data

### 2. Updated AuthContext (`src/context/AuthContext.tsx`)

- **Data cleanup on logout**: When a user logs out, their specific data is removed from localStorage
- **User-specific data management**: Ensures proper data separation between users

### 3. Updated Components

#### ActivityTracker (`src/components/ActivityTracker.tsx`)
- **Authentication check**: Only allows activity tracking when a user is logged in
- **User prompt**: Shows a login prompt when no user is logged in
- **User validation**: Prevents activity submission without authentication

#### DailyDashboard (`src/components/DailyDashboard.tsx`)
- **Authentication check**: Only displays user stats when logged in
- **Welcome message**: Shows a welcome message for non-authenticated users
- **User-specific data**: Displays only the current user's data

#### History Page (`src/pages/History.tsx`)
- **Authentication check**: Only shows activity history for logged-in users
- **Login prompt**: Displays appropriate messaging for non-authenticated users
- **User-specific data**: Shows only the current user's activity history

#### LeaderboardPage (`src/pages/LeaderboardPage.tsx`)
- **Authentication check**: Only allows leaderboard interactions when logged in
- **Login prompt**: Shows appropriate messaging for non-authenticated users
- **User-specific data**: Users can only add entries to their own leaderboard

### 4. API Service Structure (`src/services/api.ts`)

Created a mock API service that demonstrates the proper backend structure for user-specific data:

- **User-specific endpoints**: All API calls include the user ID
- **Authentication headers**: Proper authorization headers for API requests
- **Data isolation**: Each user's data is fetched and stored separately
- **Error handling**: Proper error handling for API operations

## Data Storage Structure

### Local Storage Keys
- **User data**: `burnmate-user` (stores current user information)
- **User activities**: `burnmate-activities-${userId}` (stores user-specific activities)
- **User leaderboard**: `burnmate-leaderboard-${userId}` (stores user-specific leaderboard entries)

### Data Models
```typescript
interface Activity {
  id: string;
  userId: string;        // NEW: Links activity to specific user
  name: string;
  calories: number;
  timestamp: Date;
  duration?: number;
}

interface LeaderboardEntry {
  id: string;
  userId: string;        // NEW: Links entry to specific user
  name: string;
  activity: string;
  calories: number;
  funCaption?: string;
}
```

## How It Works

### 1. User Login
1. User logs in and receives a unique user ID
2. User ID is stored in localStorage
3. BurnContext loads user-specific data using the user ID

### 2. Data Operations
1. All data operations (add, fetch, update) include the user ID
2. Data is stored in user-specific localStorage keys
3. Components only display data for the current user

### 3. User Logout
1. User-specific data is cleared from localStorage
2. User context is reset
3. Components show appropriate login prompts

### 4. Data Persistence
1. Each user's data is stored separately
2. Data persists between sessions for the same user
3. No data leakage between different users

## Backend Implementation (Future)

When implementing a real backend, follow this structure:

### API Endpoints
```typescript
// Get user activities
GET /api/activities?userId=${userId}

// Add user activity
POST /api/activities
Body: { userId, name, calories, duration }

// Get user leaderboard
GET /api/leaderboard?userId=${userId}

// Add leaderboard entry
POST /api/leaderboard
Body: { userId, name, activity, calories, funCaption }

// Clear user data
DELETE /api/user-data/${userId}
```

### Database Queries
```sql
-- Get user activities
SELECT * FROM activities WHERE userId = ?;

-- Get user leaderboard entries
SELECT * FROM leaderboard WHERE userId = ?;

-- Add user activity
INSERT INTO activities (userId, name, calories, timestamp, duration) VALUES (?, ?, ?, ?, ?);
```

## Security Considerations

1. **User Authentication**: Always verify user identity before data operations
2. **Data Isolation**: Never allow users to access other users' data
3. **Input Validation**: Validate all user inputs to prevent data corruption
4. **Session Management**: Implement proper session handling and token validation

## Testing User Separation

To test that user data separation works correctly:

1. **Login as User A**: Add some activities and leaderboard entries
2. **Logout**: Verify data is cleared from the UI
3. **Login as User B**: Verify no data from User A is visible
4. **Add data as User B**: Verify it's separate from User A's data
5. **Switch back to User A**: Verify only User A's data is visible

## Benefits

- **Data Privacy**: Each user's fitness data is completely private
- **Multi-user Support**: Multiple users can use the app on the same device
- **Data Integrity**: No cross-contamination between user data
- **Scalability**: Easy to extend to support multiple users
- **Security**: Proper data isolation prevents unauthorized access

## Future Enhancements

1. **Real Backend**: Replace localStorage with a proper database
2. **User Profiles**: Add user profile management
3. **Data Export**: Allow users to export their fitness data
4. **Social Features**: Add friend connections and shared challenges
5. **Data Analytics**: Provide detailed insights and progress tracking
