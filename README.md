# Art Prints Marketplace - Frontend

A modern, full-featured React + TypeScript web application for an art prints marketplace that connects artists, collectors, and print shops. Built with Vite, Firebase Authentication, and a comprehensive role-based access control system.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Application Walkthrough](#application-walkthrough)
- [User Roles & Access Control](#user-roles--access-control)
- [Core Services](#core-services)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Routing & Navigation](#routing--navigation)
- [Development Guidelines](#development-guidelines)

---

## 🎨 Overview

The Art Prints Marketplace is a comprehensive platform that enables:

- **Artists** to showcase and manage their artwork portfolios
- **Collectors** to discover, customize, and purchase art prints
- **Print Shops** to offer printing services and manage orders
- **Seamless integration** between all three parties for order fulfillment

The application features a modern, responsive UI with Firebase authentication, role-based access control, shopping cart functionality, and integrated payment processing.

---

## ✨ Key Features

### For Collectors (General Users)
- Browse curated artwork collections
- Customize prints (size, material, framing options)
- Add items to cart with real-time price calculations
- Secure checkout process with M-Pesa integration
- Order tracking and payment status monitoring
- User profile management

### For Artists
- Dedicated Artist Management Console
- Upload and manage artwork portfolios
- Set pricing and availability
- Track sales and earnings
- Profile customization with bio and social links
- Artwork analytics

### For Print Shops
- Print Shop Management Console
- Configure services (printing, framing, delivery)
- Set pricing matrices for different materials and sizes
- Manage shop profile and contact information
- Order fulfillment workflow

### Technical Features
- Firebase Authentication (Email/Password & Google Sign-In)
- Role-based access control (artist, printShop, collector)
- Protected routes with authentication guards
- Responsive design for all screen sizes
- Real-time cart management
- Toast notifications for user feedback
- Error boundary for graceful error handling

---

## 🛠 Technology Stack

### Core Framework
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite (Rolldown)** - Build tool and dev server

### Routing & Navigation
- **React Router DOM 7.9.6** - Client-side routing

### Authentication & Backend
- **Firebase 12.6.0** - Authentication and user management
- Custom REST API integration for backend services

### UI Components & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Shadcn/ui** - Component library built on Radix UI
- **Recharts 3.5.0** - Data visualization for analytics

### State Management
- **React Context API** - Global state (Auth, Cart)
- **React Hooks** - Local component state

### Utilities
- **clsx & tailwind-merge** - Conditional class management
- **Sonner** - Toast notifications
- **class-variance-authority** - Component variant management

---

## 📁 Project Architecture

```
art-front/
├── public/                    # Static assets
├── src/
│   ├── app/                   # App-level configurations
│   ├── assets/                # Images, fonts, static files
│   ├── components/            # React components
│   │   ├── artists/          # Artist-related components
│   │   ├── artworks/         # Artwork display components
│   │   ├── auth/             # Authentication components
│   │   ├── features/         # Feature-specific components
│   │   │   ├── cart/        # Cart functionality
│   │   │   ├── checkout/    # Checkout flow
│   │   │   ├── home/        # Homepage components
│   │   │   └── orders/      # Order management
│   │   ├── navigation/       # Header, Footer, Navigation
│   │   ├── printshop/        # Print shop components
│   │   └── ui/              # Reusable UI components (Shadcn)
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── CartContext.tsx  # Shopping cart state
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Third-party library configs
│   │   └── firebase.ts      # Firebase initialization
│   ├── pages/                # Page-level components
│   │   ├── Home.tsx
│   │   ├── Artists.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   ├── PaymentStatus.tsx
│   │   ├── ArtistManagementConsole.tsx
│   │   └── PrintShop.tsx
│   ├── services/             # API service layer
│   │   ├── artworks.ts
│   │   ├── artists.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── payment.ts
│   │   ├── printshop.ts
│   │   └── matching.ts
│   ├── styles/               # Global styles and themes
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Root application component
│   ├── main.tsx              # Application entry point
│   └── ErrorBoundary.tsx     # Error handling wrapper
├── .env                       # Environment variables (gitignored)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Firebase project with Authentication enabled
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/mac/Desktop/D.Apps/art-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Environment Configuration

The application uses Vite's environment variable system. All variables must be prefixed with `VITE_` to be accessible in the client-side code.

### Accessing Environment Variables

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---
### Testing (Recommended)
- Write unit tests for utility functions
- Test component rendering and interactions
- Mock API calls in tests
- Test authentication flows
- Test protected route access

### Performance
- Lazy load routes and heavy components
- Optimize images and assets
- Minimize bundle size
- Use React.memo for expensive components
- Implement pagination for large lists

---
## 🔧 Build & Deployment

### Development Build
```bash
npm run dev
```
- Runs on `http://localhost:5173`
- Hot module replacement enabled
- Source maps for debugging

### Production Build
```bash
npm run build
```
- TypeScript compilation
- Vite optimization
- Minification and tree-shaking
- Output to `dist/` directory

### Preview Production
```bash
npm run preview
```
- Test production build locally
- Runs on `http://localhost:4173`

### Deployment Checklist
- [ ] Update environment variables for production
- [ ] Test all authentication flows
- [ ] Verify API endpoints are correct
- [ ] Test payment integration
- [ ] Check responsive design on all devices
- [ ] Verify role-based access control
- [ ] Test error scenarios
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Set up monitoring and logging

---
**Built with ❤️ using React, TypeScript, and Firebase**
