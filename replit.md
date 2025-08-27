# MultiLang Image Caption

## Overview

MultiLang Image Caption is a full-stack web application that enables users to upload images and generate AI-powered captions in three languages: English, Telugu, and Hindi. The application features a modern, minimal interface built with React and shadcn/ui components, backed by a Node.js/Express server with PostgreSQL database storage. Users can authenticate via Replit Auth, upload images through drag-and-drop or file selection, view generated multilingual captions, and browse their caption history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **File Structure**: Clean separation with pages, components, hooks, and utilities organized in dedicated folders

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Authentication**: Replit Auth integration with OpenID Connect for secure user authentication
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **File Handling**: Multer middleware for image upload processing with file type validation and size limits
- **API Design**: RESTful endpoints following conventional patterns for user management and image operations

### Database Design
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Three main tables:
  - `users`: User profiles with Replit Auth integration
  - `images`: Image metadata with foreign key relationships to users
  - `sessions`: Session storage required for authentication
- **Migrations**: Drizzle Kit for schema management and database migrations

### Authentication & Authorization
- **Provider**: Replit Auth with OAuth2/OpenID Connect flow
- **Session Storage**: Server-side sessions stored in PostgreSQL with configurable TTL
- **Route Protection**: Middleware-based authentication checks on protected API endpoints
- **Client-side Auth**: Custom useAuth hook for authentication state management

### Image Processing Pipeline
- **Upload Handling**: Multer configured for temporary file storage with validation
- **Caption Generation**: Mock service currently implemented (designed for future AI integration with services like OpenAI GPT-4 Vision or Hugging Face BLIP)
- **File Storage**: Local filesystem storage with configurable upload directory
- **Metadata Storage**: Image details and generated captions persisted in PostgreSQL

### UI/UX Architecture
- **Design System**: shadcn/ui providing consistent, accessible components
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Loading States**: Skeleton components and loading indicators for better UX
- **Error Handling**: Toast notifications for user feedback and error states
- **Navigation**: Simple header navigation with protected route handling

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL client optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL dialect
- **express**: Web application framework for the backend API
- **@tanstack/react-query**: Server state management and caching for React
- **wouter**: Lightweight routing library for React applications

### Authentication & Session Management
- **openid-client**: OpenID Connect client for Replit Auth integration
- **passport**: Authentication middleware with OpenID Connect strategy
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store for express-session

### UI Component Libraries
- **@radix-ui/react-***: Accessible UI primitive components (dialogs, dropdowns, forms, etc.)
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally
- **tailwindcss**: Utility-first CSS framework

### File Upload & Processing
- **multer**: Middleware for handling multipart/form-data file uploads
- **@types/multer**: TypeScript definitions for Multer

### Development & Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React plugin for Vite
- **tsx**: TypeScript execution environment for development
- **esbuild**: JavaScript bundler for production builds
- **drizzle-kit**: CLI tool for database schema management and migrations

### Utility Libraries
- **date-fns**: Date utility library for formatting and manipulation
- **memoizee**: Memoization library for performance optimization
- **nanoid**: URL-safe unique string ID generator
- **ws**: WebSocket library for database connections

The application is configured for deployment on Replit with environment-specific optimizations and development tooling integrated for the Replit environment.