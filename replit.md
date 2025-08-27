# PropServe - Real Estate & Service Platform

## Overview

PropServe is a comprehensive full-stack web application that combines real estate property management with service provider connectivity. The platform supports three distinct user roles: regular users who can browse properties and book services, property owners who can list and manage their properties, and service providers who offer various services like plumbing, electrical work, healthcare, and transportation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Built using React 18 with TypeScript for type safety and modern component development
- **Vite Build System**: Fast development server and optimized production builds with hot module replacement
- **shadcn/ui Component Library**: Comprehensive UI component system built on Radix UI primitives with Tailwind CSS styling
- **React Router (Wouter)**: Lightweight client-side routing for single-page application navigation
- **TanStack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management with Zod schema validation for type-safe form handling

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing, CORS, and request logging
- **TypeScript**: Full type safety across server-side code with shared types between frontend and backend
- **In-Memory Storage**: Currently using a memory-based storage implementation with interface for easy database migration
- **WebSocket Integration**: Real-time communication capabilities using WebSocket server
- **Modular Route System**: Organized API endpoints for authentication, properties, services, and bookings

### Authentication & Authorization
- **Role-Based Access Control**: Three distinct user roles (user, owner, provider) with role-specific dashboards and permissions
- **Session Management**: Simple authentication flow with user state management through custom auth manager
- **Protected Routes**: Client-side route protection based on authentication status and user roles

### Data Management
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect configuration
- **Schema-First Approach**: Centralized schema definitions in shared directory for consistent data types
- **Zod Validation**: Runtime type checking and validation for API requests and form submissions
- **Neon Database**: PostgreSQL database service integration for production deployments

### UI/UX Design System
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and dark mode support
- **Design System**: Consistent component library with customizable themes and CSS variables
- **Responsive Design**: Mobile-first approach with adaptive layouts across device sizes
- **Accessibility**: ARIA-compliant components with keyboard navigation and screen reader support

### State Management
- **Client State**: React Query for server state, React Context for auth state, local component state with hooks
- **Form State**: React Hook Form with resolver pattern for validation and error handling
- **Real-time Updates**: WebSocket connections for live data synchronization between clients

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components like dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing and autoprefixer
- **Lucide React**: Comprehensive icon library with consistent design and accessibility features

### Development Tools
- **Vite**: Modern build tool with fast HMR, optimized bundling, and development server
- **ESBuild**: Fast JavaScript/TypeScript bundler for production server builds
- **TypeScript**: Static type checking and enhanced developer experience

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders and flexible validation
- **Zod**: TypeScript-first schema validation with static type inference
- **Hookform Resolvers**: Integration layer between React Hook Form and Zod schemas

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library for date formatting and manipulation
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: Secure, URL-friendly unique string ID generator
- **class-variance-authority**: Utility for creating type-safe component variants with Tailwind CSS