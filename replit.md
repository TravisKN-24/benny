# Overview

This is a modern AI chat application called "Benny" that provides a conversational interface for users to interact with an AI assistant. The application is built with a React frontend and Express backend, designed to offer a clean and intuitive chat experience similar to ChatGPT or Claude. The system supports real-time messaging, chat history persistence, and features a responsive design with light/dark mode support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible and customizable interface elements
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes and consistent spacing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom theme provider with Inter font and modern color palette inspired by contemporary AI chat interfaces

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **API Design**: RESTful endpoints for chat operations with structured JSON responses
- **Storage Layer**: Pluggable storage interface supporting both in-memory and database persistence
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL via Neon serverless for production with connection pooling
- **Schema**: Structured tables for users and chat messages with UUID primary keys and timestamp tracking
- **Migration System**: Drizzle Kit for database schema versioning and deployment

## Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not yet implemented
- **Planned Features**: User sessions with secure password handling and chat history isolation per user

## Chat System Design
- **Message Flow**: Real-time message exchange between user and AI with persistent storage
- **Context Management**: Recent message history included in AI requests for conversational context
- **Response Handling**: Graceful fallback responses when OpenAI API quota is exceeded
- **UI Components**: Modular chat interface with message bubbles, typing indicators, and input handling

# External Dependencies

## AI Services
- **OpenAI API**: GPT-5 model integration for generating AI responses with configurable parameters
- **Fallback System**: Intelligent pattern-matching responses when API limits are reached

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling
- **Connection Management**: Environment-based database URL configuration with SSL support

## UI and Styling
- **Radix UI**: Comprehensive primitive components for accessibility and keyboard navigation
- **Lucide Icons**: Modern icon library for consistent visual elements
- **Google Fonts**: Inter font family for optimal readability in chat interfaces

## Development Tools
- **Vite Plugins**: Runtime error overlay and development enhancements for Replit environment
- **TypeScript**: Strict type checking with path mapping for clean imports
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

## Session Management
- **Connect PG Simple**: PostgreSQL session store for future authentication implementation
- **Express Session**: Session middleware configuration ready for user authentication