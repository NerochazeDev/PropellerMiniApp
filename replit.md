# PropellerAds Telegram Mini App

## Overview

This is a Telegram Mini App built with React and Express that integrates Monetag SDK for rewarded advertising. The application allows users to watch ads through two different formats (Rewarded Interstitial and Rewarded Popup) and earn realistic rewards ($0.001-$0.003 per ad). Features include USDT TRC20 crypto withdrawals, 5% referral commission system, and comprehensive earnings tracking. The app is designed to run as a WebApp within Telegram's ecosystem.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI primitives with custom shadcn/ui components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage for development (can be extended to PostgreSQL)
- **Build Tool**: Vite for frontend bundling, esbuild for backend

### Key Components

1. **Monetag SDK Integration**
   - Integrated via script tag in HTML head
   - Two ad formats: Rewarded Interstitial and Rewarded Popup
   - Uses zone ID 9524219 for ad serving
   - Implements reward system after ad completion

2. **Telegram WebApp Integration**
   - Telegram WebApp SDK for native integration
   - Theme synchronization with Telegram app
   - Data communication with Telegram bot via sendData

3. **UI Components**
   - `AdButton`: Handles ad interaction for both formats
   - `StatusCard`: Displays user rewards and statistics
   - `MessageCard`: Shows loading, success, and error states
   - Complete shadcn/ui component library

4. **Custom Hooks**
   - `useTelegram`: Manages Telegram WebApp integration
   - `useMonetag`: Handles Monetag SDK interactions
   - `useIsMobile`: Responsive design utilities

## Data Flow

1. User clicks ad button → `AdButton` component triggers
2. `useMonetag` hook calls appropriate SDK function
3. Monetag SDK handles ad display and user interaction
4. On completion, reward is granted and state updated
5. Success/error messages displayed via `MessageCard`
6. Telegram bot receives notification via `sendData`

## External Dependencies

### Core Dependencies
- **Monetag SDK**: External ad serving platform
- **Telegram WebApp SDK**: Native Telegram integration
- **Supabase Database**: PostgreSQL database provider with API integration
- **Drizzle ORM**: Type-safe database operations

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **TanStack Query**: Server state management

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- Express server with TypeScript compilation
- In-memory storage for rapid prototyping

### Production
- Frontend: Vite build to static assets
- Backend: esbuild bundle for Node.js deployment
- Database: PostgreSQL with Drizzle migrations
- Environment: Configured for Replit deployment

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment specification

## Changelog

- July 03, 2025. Initial setup and complete Monetag integration
- July 03, 2025. Telegram Mini App fully functional with both ad formats working
- July 03, 2025. Removed Replit banner for clean production appearance
- July 03, 2025. Enhanced UI with advanced animations and modern design
- July 03, 2025. Added gradient backgrounds, glass effects, and interactive animations
- July 03, 2025. Implemented realistic earnings system with USDT TRC20 withdrawal support
- July 03, 2025. Updated all earning amounts to reflect PropellerAds/Monetag realistic rates
- July 03, 2025. Configured withdrawal system to only support USDT TRC20 with $1 minimum
- July 03, 2025. **PRODUCTION READY**: Database validation system implemented with PostgreSQL
- July 03, 2025. **DATABASE INTEGRATION**: User management, ad tracking, and earnings validation working
- July 03, 2025. **MONETAG VALIDATION**: Real ad view recording with database persistence and validation
- July 03, 2025. **AUTHENTICATION SECURITY**: Removed all demo accounts and simulation modes
- July 03, 2025. **TELEGRAM VALIDATION**: Only authentic Telegram users can access and earn rewards
- July 03, 2025. **FRAUD PREVENTION**: Rate limiting (30s between ads) and daily limits (50 ads) implemented
- July 04, 2025. **SUPABASE MIGRATION**: Migrated from Neon to Supabase PostgreSQL with API integration
- July 04, 2025. **REPLIT MIGRATION**: Successfully migrated from Replit Agent to Replit environment with full database connectivity

## User Preferences

Preferred communication style: Simple, everyday language.