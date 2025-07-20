# SEO Meta Analyzer

## Overview

This is a full-stack web application built for analyzing SEO metadata of websites. The application provides comprehensive SEO analysis including meta tags, social media tags, search previews, and actionable recommendations. It features a modern React frontend with shadcn/ui components, full dark/light mode support, PDF export functionality, and an Express.js backend with in-memory storage for development.

## Recent Changes

### January 2025
- **Theme System**: Implemented complete dark/light/system theme switching with proper CSS variables
- **PDF Export**: Added comprehensive PDF generation for SEO analysis reports with jsPDF integration
- **Clear History**: Made functional clear history button that properly removes all analysis data
- **Dark Mode UI**: Fixed all headings and text visibility issues in dark mode across all components
- **Responsive Design**: Improved mobile layout with proper padding, alignment, and responsive breakpoints
- **Settings Dialog**: Added accessible settings panel with theme controls and radio group selection

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for monorepo setup
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Theme System**: Complete dark/light/system mode support with localStorage persistence
- **Router**: Wouter for lightweight client-side routing
- **HTTP Client**: Axios for API requests
- **State Management**: TanStack Query for server state, React hooks for local state
- **PDF Generation**: jsPDF with html2canvas for comprehensive report exports
- **Responsive Design**: Mobile-first approach with proper breakpoints and spacing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for PostgreSQL
- **Database Provider**: Neon Database (PostgreSQL-compatible)
- **Web Scraping**: Cheerio for HTML parsing and meta tag extraction
- **Development**: Hot reload with Vite middleware integration

### Database Schema
The application uses a single `seo_analysis` table with the following structure:
- `id`: Primary key (serial)
- `url`: Original URL analyzed
- `title`: Page title
- `domain`: Extracted domain name
- `metaTags`: JSON object storing standard meta tags
- `ogTags`: JSON object storing Open Graph tags
- `twitterTags`: JSON object storing Twitter Card tags
- `scores`: JSON object with calculated SEO scores (overall, meta, social, technical)
- `recommendations`: JSON array of improvement suggestions
- `analyzedAt`: Timestamp of analysis

### Storage Layer
- **Interface**: `IStorage` interface for data persistence abstraction
- **Implementation**: `MemStorage` class for in-memory storage (development)
- **Future**: Designed to support database storage with Drizzle ORM

## Data Flow

1. **URL Input**: User submits a URL through the frontend form
2. **API Request**: Frontend sends POST request to `/api/analyze` endpoint
3. **Web Scraping**: Backend fetches the webpage content using Axios
4. **HTML Parsing**: Cheerio extracts meta tags, Open Graph tags, and Twitter Cards
5. **Score Calculation**: Algorithm calculates SEO scores based on tag presence and quality
6. **Recommendation Generation**: System generates actionable improvement suggestions
7. **Data Storage**: Analysis results are stored in the database/memory
8. **Response**: Structured analysis data is returned to the frontend
9. **UI Update**: React components render the analysis results with previews and recommendations

## External Dependencies

### Core Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for timestamp formatting
- **Form Validation**: Zod for schema validation
- **HTTP Requests**: Axios for reliable HTTP client

### Development Dependencies
- **Build Tools**: Vite, ESBuild for production builds
- **TypeScript**: For type safety across the stack
- **Tailwind CSS**: For utility-first styling
- **PostCSS**: For CSS processing

## Deployment Strategy

### Development Setup
- **Frontend**: Vite dev server with hot reload
- **Backend**: Express server with Vite middleware integration
- **Database**: Local PostgreSQL or Neon Database connection
- **Environment**: Development-specific error overlays and debugging tools

### Production Build
- **Frontend**: Static assets built to `dist/public` directory
- **Backend**: Compiled TypeScript to ESM modules in `dist` directory
- **Database**: Drizzle migrations for schema management
- **Deployment**: Single server deployment serving both frontend and API

### Key Architectural Decisions

1. **Monorepo Structure**: Chosen to share TypeScript types between frontend and backend, reducing duplication and ensuring type safety across API boundaries.

2. **Drizzle ORM**: Selected for its TypeScript-first approach and excellent PostgreSQL support, with built-in migration system for schema management.

3. **In-Memory Storage Fallback**: Implemented for development simplicity while maintaining the same interface for future database integration.

4. **shadcn/ui Components**: Adopted for consistent, accessible UI components with full customization control and Tailwind integration.

5. **TanStack Query**: Used for robust server state management with caching, background updates, and optimistic updates.

6. **Vite Integration**: Backend serves Vite in development for seamless full-stack development experience with hot reload.

7. **Shared Schema**: Zod schemas and TypeScript types are shared between client and server for consistent data validation and type safety.