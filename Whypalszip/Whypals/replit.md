# NewsPals - Kids News Platform

## Overview

NewsPals is a full-stack web application designed as a safe and engaging news platform for children. The application provides educational content through articles, videos, and games, with a kid-friendly interface featuring custom mascot branding and playful design elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- shadcn/ui component library (New York style variant) providing a comprehensive set of pre-built, accessible components
- Radix UI primitives for accessible, unstyled component foundations
- TailwindCSS v4 with CSS variables for theming and responsive design
- Custom fonts: Fredoka for headings and Quicksand for body text to create a child-friendly aesthetic
- Framer Motion for animations and interactive elements

**State Management & Data Fetching**
- TanStack Query (React Query) v5 for server state management, caching, and synchronization
- Custom query client configuration with credential-based fetching
- Form handling with React Hook Form and Zod validation via @hookform/resolvers

**Design Decisions**
- Component-based architecture with reusable UI components in `/client/src/components/ui`
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)
- Mobile-first responsive design approach
- Custom hook patterns for authentication (`useAuth`) and UI state (`use-toast`, `use-mobile`)

### Backend Architecture

**Server Framework**
- Express.js as the web server framework
- Node.js with TypeScript for type safety across the stack
- HTTP server created separately to support potential WebSocket upgrades

**Authentication & Session Management**
- Replit's OpenID Connect (OIDC) integration for user authentication
- Passport.js with openid-client strategy for OAuth flow
- express-session with PostgreSQL-backed session store (connect-pg-simple)
- Session cookie configuration with httpOnly, secure flags, and 7-day TTL
- Memoized OIDC configuration for performance optimization

**API Design**
- RESTful API endpoints under `/api` namespace
- Authentication middleware (`isAuthenticated`) protecting sensitive routes
- Video management endpoints (GET all, GET by ID, POST create, view counting)
- User profile endpoints with subscription status tracking

**Database Layer**
- Drizzle ORM for type-safe database operations
- Storage abstraction pattern with `IStorage` interface for potential future implementations
- Connection pooling via node-postgres (pg) Pool

**Middleware & Request Processing**
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded body parsing
- Custom logging middleware tracking request method, path, status, and duration
- Static file serving for production builds
- Request/response logging with timestamps

**Development Features**
- Vite integration in development mode with middleware
- HMR support over custom WebSocket path (`/vite-hmr`)
- Custom Vite plugins for Replit-specific features (cartographer, dev banner, runtime error overlay)
- Meta image plugin for dynamic OpenGraph image injection

### Data Storage Solutions

**Database Technology**
- PostgreSQL as the primary relational database
- Connection string configured via DATABASE_URL environment variable
- Migration system using Drizzle Kit

**Schema Design**

*Users Table*
- UUID primary key with default generation
- Email, name, and profile image fields
- Subscription tracking fields (isSubscribed, plan, start/end dates)
- Timestamps for record creation and updates

*Videos Table*
- Auto-incrementing integer primary key
- Content metadata (title, description, category, duration)
- Media URLs (thumbnail, video)
- View count tracking
- Foreign key relationship to users (uploadedBy)

*Subscriptions Table*
- Relationship to users via userId foreign key
- Plan details and pricing information
- Stripe integration fields (customerId, subscriptionId)
- Status tracking and renewal dates

*Sessions Table*
- PostgreSQL-backed session storage
- SID primary key with JSONB session data
- Expiration index for automatic cleanup

**Data Access Pattern**
- Repository pattern implemented via DatabaseStorage class
- Type-safe operations using Drizzle ORM and zod schemas
- Atomic operations for upserts and updates
- Query builders for filtering and sorting

### External Dependencies

**Authentication Provider**
- Replit OIDC for user authentication and identity management
- Automatic user profile synchronization on login

**Payment Processing**
- Stripe integration prepared for subscription management (schema includes Stripe customer and subscription IDs)

**Development Tools**
- Replit-specific Vite plugins for enhanced development experience
- TypeScript compiler for type checking
- ESBuild for server-side bundling with selective dependency bundling

**Build & Deployment**
- Custom build script bundling client (Vite) and server (ESBuild) separately
- Server dependencies selectively bundled to optimize cold start performance
- Static asset serving from `/dist/public` in production
- Environment-based configuration (NODE_ENV)

**UI Libraries**
- Lucide React for icon system
- date-fns for date formatting and manipulation
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional className composition

**Media & Assets**
- Custom generated images stored in `/attached_assets/generated_images`
- Public assets (favicon, opengraph images) in `/client/public`
- Font loading from Google Fonts (Fredoka and Quicksand families)

### Mini-Games System (Added December 2025)

**Game Templates**
The application includes 5 reusable mini-game templates that admins can customize:
1. **Puzzle** - Sliding puzzle game with configurable grid size and image (480px desktop, responsive mobile)
2. **Whack-a-Mole** - Tap-to-score game with targets and distractors (1400ms spawn interval, child-friendly)
3. **Memory Match** - Card matching game with customizable pairs (520px desktop, responsive mobile)
4. **Quiz** - Multiple choice questions with explanations (full-width responsive)
5. **Timeline** - Drag-and-drop chronological ordering

**Scoring System**
- All games use standardized 0-100 scoring
- Minimum score of 10 ensures positive reinforcement for children
- Scoring formulas consider time penalties, move/attempt penalties
- CongratulationsScreen with confetti, star ratings (3 stars for 90%+), and replay options

**Audio System**
- useGameAudio hook manages background music and sound effects
- Sound effects: click, success, error, move, match, complete, fanfare
- Audio elements cached globally to prevent redundant loading
- Proper cleanup on component unmount
- User gesture detection for autoplay compliance

**Database Schema: storyGames**
- id, title, description, thumbnail
- gameType (puzzle, whack, match, quiz, timeline)
- config (JSONB storing template-specific configuration)
- linkedStoryTitle (text field for flexible story linking)
- funFacts, howToPlay (content for game preview page)
- pointsReward (points awarded on completion)
- backgroundMusicUrl (optional URL for background music)
- soundEffectsEnabled (boolean, default true)
- isActive (visibility toggle)

**Admin Routes**
- GET/POST/PUT/DELETE `/api/admin/games` - Full CRUD for games
- Admin access requires password authentication (SuksesMandiri777)

**Public Routes**
- GET `/api/games` - List all active games
- GET `/api/games/:id` - Get single game details
- GET `/api/games/by-story/:storyTitle` - Get games linked to a story
- POST `/api/games/:id/complete` - Submit score and earn points (auth required)

**Game Flow**
1. Games list page with card grid
2. Game preview page (fun facts, how to play instructions)
3. Start game button launches actual gameplay
4. Score submission awards proportional points based on performance

### Teacher Coursework Marketplace (Added December 2025)

**Overview**
Teachers can upload and sell educational materials to students. Features placeholder monetization (no real payments).

**User Roles**
- Users choose Teacher or Student role in Settings
- Teachers can access the Teacher Dashboard and upload coursework
- Students can browse and "purchase" content (placeholder)

**Coursework Types**
- PDF Worksheet
- Unit Plan
- Weekly Lesson Bundle
- Homework Pack
- Reading Comprehension Set
- Project-Based Learning Assignment
- Educational Video
- Quiz (tied to NewsPals article)

**Subjects**
Math, Science, English, History, Geography, Art, Music, Physical Education, Social Studies, Technology, Foreign Language, Other

**Database Schema**
- `coursework_items` table with: id, teacherId, title, description, itemType, subject, fileKey, linkUrl, linkedArticleId, price (cents), salesCount, isPublished, thumbnailUrl
- Users table extended with: userRole, bio, subjectsTaught, experienceYears, reputationScore, totalSales, badges

**Frontend Routes**
- `/teachers` - Marketplace landing page with hero, features, top products/teachers
- `/teacher-dashboard` - Teacher-only dashboard for managing coursework
- `/marketplace` - Public marketplace with filters (type, subject, price)
- `/marketplace/:id` - Coursework detail page with buy button (placeholder)
- `/teacher/:id` - Teacher profile page with stats and published items
- `/leaderboard` - Top teachers and best-selling products

**API Endpoints**
Public:
- GET `/api/marketplace` - List published coursework
- GET `/api/marketplace/:id` - Get single item
- GET `/api/marketplace/leaderboard/teachers` - Top 10 teachers
- GET `/api/marketplace/leaderboard/products` - Top 10 products
- GET `/api/teachers` - List all teachers
- GET `/api/teachers/:id` - Teacher profile with items

Protected (requires auth):
- POST `/api/user/role` - Set user role (teacher/student)
- PUT `/api/teacher/profile` - Update teacher profile (teacher only)
- GET `/api/teacher/coursework` - List own coursework (teacher only)
- POST `/api/teacher/coursework` - Create coursework (teacher only)
- PUT `/api/teacher/coursework/:id` - Update coursework (teacher only)
- DELETE `/api/teacher/coursework/:id` - Delete coursework (teacher only)

**Monetization Model (Placeholder)**
- Teachers earn 80-90% of each sale
- Platform takes 10-20% commission
- All payment functionality is placeholder - no real transactions

### Email Verification & User Settings (Added December 2025)

**Database Schema Updates**
Users table extended with:
- `emailVerified` (boolean) - Whether email is verified
- `emailVerificationToken` (varchar) - Token for email verification
- `emailVerificationExpiry` (timestamp) - Token expiration
- `agreedToTerms` (boolean) - Terms of service agreement status
- `agreedToTermsAt` (timestamp) - When terms were agreed to
- `marketingEmailsOptIn` (boolean) - Marketing email preference
- `contentAlertsOptIn` (boolean) - Content alert preference
- `teacherUpdatesOptIn` (boolean) - Teacher marketplace updates preference

**Registration Flow**
- Users must agree to Terms of Service and Privacy Policy before registration
- Terms checkbox with clickable links to view full terms in a dialog
- Registration blocked if terms not agreed to
- agreedToTerms and agreedToTermsAt stored in user record

**Settings Page Features**
Three functional settings dialogs:
1. **Profile Dialog** - Edit first/last name, change password with current password verification
2. **Notifications Dialog** - Toggle marketing emails, content alerts, teacher updates
3. **Privacy & Safety Dialog** - View complete privacy policy and safety guidelines

**API Endpoints**
- PATCH `/api/user/profile` - Update user name (firstName, lastName)
- POST `/api/user/change-password` - Change password with current password verification
- PATCH `/api/user/notifications` - Update email notification preferences

**Email Verification (Prepared)**
Infrastructure prepared for email verification with Resend API:
- Token generation and storage
- Verification link flow
- Email verification status display in settings
- Placeholder ready for @newspals.com domain integration

### Activity Tracking & Points System (Added December 2025)

**Overview**
Tracks user engagement through reading, watching, and playing activities. Uses Singapore timezone (Asia/Singapore) with daily reset at 00:00 SGT.

**Database Schema**

*user_daily_activity Table*
- id (serial primary key)
- user_id (UUID, foreign key to users)
- activity_date (date) - Date in Singapore timezone
- reading_seconds (integer, default 0)
- watching_seconds (integer, default 0)
- play_seconds (integer, default 0)
- created_at, updated_at (timestamps)
- Unique constraint on (user_id, activity_date)

*user_points_ledger Table*
- id (serial primary key)
- user_id (UUID, foreign key to users)
- points_delta (integer) - Points added/removed
- source_type (varchar) - e.g., "game_completion", "manual_adjustment"
- source_id (integer, optional) - Reference to game/content
- balance_after (integer) - User's total points after this change
- created_at (timestamp)

*user_game_completions Table*
- id (serial primary key)
- user_id (UUID, foreign key to users)
- game_id (integer, foreign key to story_games)
- score (integer) - Game score (0-100)
- points_awarded (integer) - Points earned
- completed_at (timestamp)

*Users Table Extension*
- total_points (integer, default 0) - Cached total points for quick access

**API Endpoints**
- GET `/api/activity/today` - Get today's activity (reading/watching/play time)
- POST `/api/activity/track` - Track activity time (requires auth)
- GET `/api/points` - Get user's total points
- POST `/api/points/add` - Add points (admin only)
- POST `/api/games/:id/complete` - Complete game and earn points (requires auth)