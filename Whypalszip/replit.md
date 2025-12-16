# NewsPals - Kids News Platform

## Overview
NewsPals is a full-stack web application designed as a safe and engaging news platform for children. It offers educational content via articles, videos, and games, all within a kid-friendly interface featuring custom mascot branding and playful design. The platform includes a mini-games system and a teacher coursework marketplace, aiming to engage children and provide educational resources, with future ambitions for robust monetization and community features.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Frameworks**: React 18 with TypeScript, Vite for build and HMR, Wouter for routing.
- **UI/UX**: shadcn/ui (New York style), Radix UI primitives, TailwindCSS v4 with CSS variables, custom fonts (Fredoka, Quicksand), Framer Motion for animations.
- **State Management**: TanStack Query v5 for server state, React Hook Form with Zod for form validation.
- **Design Patterns**: Component-based architecture, path aliases, mobile-first responsive design, custom hooks for authentication and UI state.

### Backend Architecture
- **Server**: Express.js with Node.js and TypeScript.
- **Authentication**: Replit's OpenID Connect (OIDC) via Passport.js, express-session with PostgreSQL store.
- **API Design**: RESTful API, authentication middleware.
- **Database ORM**: Drizzle ORM for type-safe operations, PostgreSQL for data storage.
- **Middleware**: JSON/URL-encoded body parsing, custom logging, static file serving.
- **Development**: Vite integration for HMR, custom Vite plugins for Replit-specific features.

### Data Storage Solutions
- **Database**: PostgreSQL as the primary relational database, Drizzle Kit for migrations.
- **Schema Design**:
    - `Users`: UUID, email, name, profile image, subscription status, role, bio, total points, email verification, terms agreement, notification preferences.
    - `Videos`: Content metadata, media URLs, view count, uploader.
    - `Subscriptions`: Plan details, Stripe integration fields.
    - `Sessions`: PostgreSQL-backed session storage.
    - `storyGames`: id, title, description, thumbnail, gameType, config (JSONB), linkedStoryTitle, funFacts, howToPlay, pointsReward, backgroundMusicUrl, soundEffectsEnabled, isActive.
    - `coursework_items`: teacherId, title, description, itemType, subject, fileKey, linkedArticleId, price, salesCount, isPublished, thumbnailUrl.
    - `user_daily_activity`: userId, activityDate, reading/watching/play seconds (Singapore timezone).
    - `user_points_ledger`: userId, pointsDelta, sourceType, sourceId, balanceAfter.
    - `user_game_completions`: userId, gameId, score, pointsAwarded.
- **Data Access**: Repository pattern via `DatabaseStorage` class, type-safe operations with Drizzle ORM.

### Key Features
- **Mini-Games System**: 5 customizable templates (Puzzle, Whack-a-Mole, Memory Match, Quiz, Timeline) with a 0-100 scoring system, minimum 10 points for positive reinforcement, audio system, and admin CRUD for games.
- **Teacher Coursework Marketplace**: Teachers can upload and sell educational materials (PDFs, lesson plans, videos, quizzes). Features user roles (Teacher/Student), various coursework types, subjects, and marketplace/dashboard views. Includes placeholder monetization.
- **Email Verification & User Settings**: Extended user profile with email verification status, terms of service agreement, and notification preferences. Settings page for profile editing, notification toggles, and privacy policy viewing.
- **Activity Tracking & Points System**: Tracks user engagement (reading, watching, playing) daily in Singapore timezone. Awards points for game completion and other activities, stored in a points ledger.

## External Dependencies
- **Authentication**: Replit OIDC.
- **Payment Processing**: Stripe (prepared for integration).
- **Development Tools**: Replit-specific Vite plugins, TypeScript, ESBuild.
- **UI Libraries**: Lucide React (icons), date-fns, class-variance-authority (CVA), clsx, tailwind-merge.
- **Media & Assets**: Custom generated images, public assets, Google Fonts.
- **Email Service**: Resend API (prepared for email verification).