# LinkAndLearnLabs API Contracts

## Authentication Flow

### Google OAuth Integration (Emergent Managed)
- **Login Flow**: User clicks "Sign In" → Redirects to `https://auth.emergentagent.com/?redirect=${dashboard_url}`
- **Callback**: User lands at `/dashboard#session_id={session_id}`
- **Session Exchange**: Frontend calls backend `/api/auth/session` with session_id to get user data
- **Session Storage**: Backend stores session in MongoDB with 7-day expiry
- **Cookie**: Set httpOnly cookie with session_token

### User Model
```json
{
  "id": "string (auto-generated)",
  "email": "string (from Google)",
  "name": "string (from Google)",
  "picture": "string (Google profile picture URL)",
  "joined": "datetime",
  "buildsShared": "number (default: 0)",
  "coursesCompleted": "number (default: 0)",
  "communityRank": "string (default: Bronze)"
}
```

### Session Model
```json
{
  "session_token": "string (from Emergent)",
  "user_id": "string (reference to user)",
  "expires_at": "datetime (7 days from creation)",
  "created_at": "datetime"
}
```

## API Endpoints

### Authentication Endpoints

**POST /api/auth/session**
- Body: `{ "session_id": "string" }`
- Action: Exchange session_id for user data via Emergent API
- Response: `{ "user": {...}, "session_token": "..." }`
- Sets httpOnly cookie with session_token

**GET /api/auth/me**
- Headers: Cookie with session_token
- Response: Current user object
- Error: 401 if not authenticated

**POST /api/auth/logout**
- Headers: Cookie with session_token
- Action: Delete session from DB, clear cookie
- Response: `{ "success": true }`

### Learning Paths Endpoints

**GET /api/learning-paths**
- Response: Array of learning path objects
- Public endpoint

**GET /api/learning-paths/:id**
- Response: Single learning path with modules
- Public endpoint

**POST /api/learning-paths/:id/enroll** (Protected)
- Headers: Cookie with session_token
- Action: Add user to enrolled list, increment enrolled count
- Response: Updated learning path

### Featured Builds Endpoints

**GET /api/builds**
- Query params: `?limit=10&offset=0`
- Response: Array of build objects
- Public endpoint

**POST /api/builds** (Protected)
- Headers: Cookie with session_token
- Body: `{ "title": "...", "specs": "...", "image": "..." }`
- Action: Create new build, increment user's buildsShared
- Response: Created build object

**POST /api/builds/:id/like** (Protected)
- Headers: Cookie with session_token
- Action: Increment likes count
- Response: Updated build object

### Events Endpoints

**GET /api/events**
- Query params: `?upcoming=true`
- Response: Array of event objects
- Public endpoint

**POST /api/events/:id/register** (Protected)
- Headers: Cookie with session_token
- Action: Add user to attendees list, increment attendee count
- Response: Updated event object

### Forum Endpoints

**GET /api/forum/topics**
- Query params: `?category=...&limit=20&offset=0`
- Response: Array of forum topic objects
- Public endpoint

**POST /api/forum/topics** (Protected)
- Headers: Cookie with session_token
- Body: `{ "title": "...", "category": "...", "content": "..." }`
- Response: Created topic object

**POST /api/forum/topics/:id/reply** (Protected)
- Headers: Cookie with session_token
- Body: `{ "content": "..." }`
- Action: Add reply, increment reply count
- Response: Created reply object

## Mock Data Currently in Frontend (mock.js)

### To Migrate to Backend:
1. **mockLearningPaths** → MongoDB collection: `learning_paths`
2. **mockFeaturedBuilds** → MongoDB collection: `builds`
3. **mockEvents** → MongoDB collection: `events`
4. **mockForumTopics** → MongoDB collection: `forum_topics`
5. **mockUser** → Will be real user data from Google OAuth

## Frontend Integration Steps

1. **Add Authentication Context** (`/frontend/src/context/AuthContext.jsx`)
   - Manage user state globally
   - Handle session_id from URL fragment
   - Check existing session on mount

2. **Update API calls** in components:
   - Replace mock data imports with API calls
   - Use axios with credentials: 'include' for cookies
   - Handle loading and error states

3. **Protected Routes**:
   - Wrap Dashboard and other protected pages
   - Redirect to home if not authenticated

4. **Update Components**:
   - Home.jsx: Replace mock data with API calls
   - Dashboard.jsx: Fetch user data, handle auth
   - Add loading states during data fetch

## Backend Implementation Priority

1. **Phase 1: Authentication**
   - Emergent Google OAuth integration
   - Session management
   - User CRUD operations

2. **Phase 2: Core Features**
   - Learning paths (read-only initially)
   - Featured builds (with create & like)
   - Events (with registration)

3. **Phase 3: Community Features**
   - Forum topics and replies
   - User profiles
   - Notifications

## Notes
- All protected endpoints require valid session_token in cookie
- Use timezone-aware datetime for all timestamps
- Implement proper error handling and validation
- Add indexes on frequently queried fields (user_id, created_at)
