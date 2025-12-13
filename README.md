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

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-123` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |

### Accessing Environment Variables

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🎯 Application Walkthrough

### 1. Homepage & Discovery

**Route:** `/`  
**Access:** Public

The homepage serves as the primary entry point for all users:

- **Hero Section**: Large, impactful headline with subtitle describing the platform's value proposition
- **Featured Artworks Grid**: Displays up to 12 curated artworks from the backend
- **Navigation Header**: Logo, navigation links, cart icon, and authentication buttons
- **Footer**: Company information and navigation links

**Key Components:**
- `HomePage` - Main page wrapper with data fetching
- `Hero` - Hero section with headline and subtitle
- `ArtGrid` - Responsive grid displaying artwork cards
- `ArtCard` - Individual artwork display with add-to-cart functionality
- `Header` - Navigation bar with authentication state
- `Footer` - Site footer

**User Flow:**
1. User lands on homepage
2. Browses featured artworks
3. Clicks on artwork to view details (triggers modal or detail view)
4. Can add items to cart (requires authentication)
5. Can sign up/login via header buttons

---

### 2. Authentication System

**Components:** `LoginModal`, `SignupModal`  
**Context:** `AuthContext`

The application uses Firebase Authentication with two sign-in methods:

#### Login Flow
1. User clicks "Login" in header
2. Modal appears with two options:
   - Email/Password login
   - Google Sign-In
3. Upon successful authentication:
   - Firebase user is created/retrieved
   - ID token is sent to backend to create session cookie
   - User roles are fetched from backend
   - User is redirected to appropriate page
4. Toast notification confirms successful login

#### Signup Flow
1. User clicks "Sign Up" in header
2. Modal appears with form fields:
   - Email
   - Password
   - Display Name
   - User Type (Artist, Print Shop, Collector)
3. Upon submission:
   - Firebase user account is created
   - User profile is updated with display name
   - Backend is notified to create user record with selected role
   - Session cookie is created
   - User is automatically logged in
4. Toast notification confirms successful signup

#### Authentication State Management

The `AuthContext` provides:
- `user` - Current authenticated user with roles
- `loading` - Authentication state loading indicator
- `error` - Authentication error messages
- `isAuthenticated` - Boolean authentication status
- `loginWithEmail()` - Email/password login method
- `loginWithGoogle()` - Google OAuth login method
- `signupWithEmail()` - User registration method
- `logout()` - Sign out method
- `clearError()` - Error state reset

**Protected Features:**
- Cart access
- Checkout process
- Order history
- Artist console
- Print shop console

---

### 3. Artwork Browsing & Customization

**Route:** `/` (Homepage) and `/artists`  
**Components:** `ArtCard`, `ArtworkDetailModal` (if implemented)

#### Artwork Display
Each artwork card shows:
- Artwork image
- Title
- Artist name (if available)
- Description
- Add to cart button (with authentication check)

#### Customization Options
When adding to cart, users can customize:
- **Material**: Canvas, Photo Paper, Fine Art Paper, Metal, Acrylic
- **Size**: Various dimensions (e.g., 8x10, 11x14, 16x20, 24x36)
- **Frame**: None, Black Frame, White Frame, Natural Wood, Dark Wood

**Price Calculation:**
Prices are dynamically calculated based on:
- Base artwork price
- Selected material cost
- Size multiplier
- Frame cost
- Print shop pricing matrix

---

### 4. Shopping Cart

**Route:** `/cart`  
**Access:** Protected (requires authentication)  
**Context:** `CartContext`

#### Cart Features
- View all items added to cart
- See customization details (material, size, frame)
- Adjust quantities
- Remove items
- View subtotal and total price
- Proceed to checkout

#### Cart State Management

The `CartContext` provides:
- `cartItems` - Array of cart items
- `addToCart()` - Add item to cart
- `removeFromCart()` - Remove item by ID
- `updateQuantity()` - Update item quantity
- `clearCart()` - Empty entire cart
- `isItemInCart()` - Check if artwork is in cart
- `cartItemCount` - Total number of items

**Cart Item Structure:**
```typescript
interface CartItem {
  id: number;
  artId?: number;
  title: string;
  material: string;
  size: string;
  frame: string;
  image?: string;
  price: number;
  quantity: number;
}
```

#### Cart Persistence
- Cart state is maintained in React Context
- Persists during session (lost on page refresh - could be enhanced with localStorage)

---

### 5. Checkout Process

**Route:** `/checkout`  
**Access:** Protected (requires authentication)  
**Component:** `Checkout`

#### Checkout Flow

**Step 1: Delivery Information**
- Full name
- Email address
- Phone number
- Delivery address
- City
- Postal code

**Step 2: Print Shop Selection**
- Automatic matching based on location/availability
- Display matched print shop details
- Option to select different print shop (if available)

**Step 3: Order Review**
- Review all cart items
- Verify delivery information
- See order summary with totals
- Accept terms and conditions

**Step 4: Payment**
- M-Pesa integration
- Phone number for payment
- Payment amount confirmation
- Submit order

#### Backend Integration
1. Order is created via `/checkout` endpoint
2. Order ID is returned
3. Payment is initiated via `/payment/initiate` endpoint
4. User is redirected to payment status page

---

### 6. Payment & Order Tracking

**Route:** `/payment-status/:paymentId`  
**Access:** Protected (requires authentication)  
**Component:** `PaymentStatus`

#### Payment Status Flow
1. User is redirected after checkout
2. Page polls payment status every 3 seconds
3. Displays current status:
   - **Pending**: Awaiting payment confirmation
   - **Processing**: Payment received, order being processed
   - **Completed**: Order successfully placed
   - **Failed**: Payment failed
4. Shows order details and next steps
5. Provides option to view all orders

#### Order History

**Route:** `/orders`  
**Access:** Protected (requires authentication)  
**Component:** `Orders`

Features:
- View all past orders
- Filter by status (pending, processing, completed, cancelled)
- See order details (items, delivery info, payment status)
- Track order progress
- Reorder functionality (if implemented)

---

### 7. Artist Management Console

**Route:** `/artist-console`  
**Access:** Role-protected (requires `artist` role)  
**Component:** `ArtistManagementConsole`

This is a comprehensive dashboard for artists to manage their presence on the platform.

#### Features

**Profile Management**
- Edit artist bio and description
- Add social media links (Instagram, Twitter, Website)
- Upload profile picture
- Set contact information

**Artwork Management**
- Upload new artworks
- Edit existing artwork details:
  - Title
  - Description
  - Category/tags
  - Pricing
  - Availability status
- Delete artworks
- View artwork analytics (views, likes, sales)

**Sales Dashboard**
- View total earnings
- Track artwork sales
- See popular artworks
- Analytics charts (using Recharts)

**Portfolio Organization**
- Organize artworks into collections
- Set featured artworks
- Manage artwork visibility

#### Artist Profile Structure
```typescript
interface ArtistProfile {
  uid: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  artworks: Artwork[];
  stats: {
    totalSales: number;
    totalEarnings: number;
    totalArtworks: number;
  };
}
```

---

### 8. Print Shop Console

**Route:** `/print-shop`  
**Access:** Role-protected (requires `printShop` role)  
**Component:** `PrintShop`

Comprehensive management interface for print shop operators.

#### Features

**Shop Profile Setup**
- Business name and description
- Contact information
- Business address
- Operating hours
- Service area/delivery zones

**Services Configuration**
- Enable/disable services:
  - Printing
  - Framing
  - Delivery
  - Pickup
- Set service descriptions
- Configure turnaround times

**Pricing Matrix**
- Set prices for different materials:
  - Canvas
  - Photo Paper
  - Fine Art Paper
  - Metal
  - Acrylic
- Configure size-based pricing
- Set frame prices
- Delivery fee configuration

**Order Management**
- View incoming orders
- Update order status
- Manage fulfillment workflow
- Communication with customers

#### Print Shop Data Structure
```typescript
interface PrintShopProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  services: {
    printing: boolean;
    framing: boolean;
    delivery: boolean;
  };
  pricingMatrix: {
    materials: Record<string, number>;
    sizes: Record<string, number>;
    frames: Record<string, number>;
  };
}
```

---

## 🔐 User Roles & Access Control

### Role Types

1. **Collector (Default)**
   - Browse artworks
   - Purchase prints
   - Manage cart and orders
   - View order history

2. **Artist**
   - All collector permissions
   - Access to Artist Management Console
   - Upload and manage artworks
   - View sales analytics

3. **Print Shop**
   - Access to Print Shop Console
   - Manage shop profile
   - Configure services and pricing
   - Process orders

### Access Control Implementation

#### Protected Routes
```typescript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```
- Checks if user is authenticated
- Redirects to login if not authenticated
- Shows login modal for unauthenticated users

#### Role-Protected Routes
```typescript
<RoleProtectedRoute allowedRoles={['artist']}>
  <ArtistConsole />
</RoleProtectedRoute>
```
- Checks authentication first
- Verifies user has required role
- Shows "Access Denied" message if role doesn't match
- Redirects to homepage with error message

### Role Assignment
- Roles are assigned during signup via user type selection
- Stored in backend database
- Fetched and cached in AuthContext
- Validated on both frontend and backend

---

## 🔌 Core Services

All API interactions are centralized in the `services/` directory. Each service module handles a specific domain.

### Artworks Service (`artworks.ts`)

```typescript
// Fetch all artworks
fetchArtworks(): Promise<Artwork[]>

// Fetch single artwork by ID
fetchArtworkById(id: string): Promise<Artwork>
```

**Artwork Interface:**
```typescript
interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  artistName?: string;
  price: number;
  category?: string;
  tags?: string[];
  createdAt: string;
}
```

---

### Artists Service (`artists.ts`)

```typescript
// Get artist profile
getProfile(): Promise<ArtistProfile>

// Update artist profile
updateProfile(data: Partial<ArtistProfile>): Promise<void>

// Upload artwork
uploadArtwork(formData: FormData): Promise<Artwork>

// Update artwork
updateArtwork(id: string, data: Partial<Artwork>): Promise<void>

// Delete artwork
deleteArtwork(id: string): Promise<void>
```

---

### Cart Service (`cart.ts`)

```typescript
// Add item to cart (backend sync)
addToCart(item: CartItem): Promise<void>

// Get cart items
getCartItems(): Promise<CartItem[]>

// Update cart item
updateCartItem(id: string, quantity: number): Promise<void>

// Remove from cart
removeFromCart(id: string): Promise<void>

// Clear cart
clearCart(): Promise<void>
```

---

### Orders Service (`orders.ts`)

```typescript
// Create order (checkout)
createOrder(orderData: OrderRequest): Promise<Order>

// Get user orders
getOrders(): Promise<Order[]>

// Get order by ID
getOrderById(id: string): Promise<Order>

// Update order status
updateOrderStatus(id: string, status: OrderStatus): Promise<void>
```

---

### Payment Service (`payment.ts`)

```typescript
// Initiate M-Pesa payment
initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse>

// Check payment status
checkPaymentStatus(paymentId: string): Promise<PaymentStatus>

// Verify payment
verifyPayment(paymentId: string): Promise<PaymentVerification>
```

---

### Print Shop Service (`printshop.ts`)

```typescript
// Create/update shop profile
createShopProfile(data: ShopProfileData): Promise<void>

// Get shop profile
getShopProfile(): Promise<PrintShopProfile>

// Update services
updateServices(services: ServiceConfig): Promise<void>

// Update pricing matrix
updatePricing(pricing: PricingMatrix): Promise<void>

// Get shop orders
getShopOrders(): Promise<Order[]>
```

---

### Matching Service (`matching.ts`)

```typescript
// Find print shops for order
matchPrintShops(orderData: MatchRequest): Promise<PrintShop[]>

// Get recommended print shop
getRecommendedShop(location: string): Promise<PrintShop>
```

---

## 🧩 Component Structure

### UI Components (`components/ui/`)

Reusable components built with Shadcn/ui and Radix UI:

- **button** - Customizable button with variants
- **input** - Form input field
- **label** - Form label
- **card** - Container component
- **dialog** - Modal dialog
- **toast** - Notification component (Sonner)
- **select** - Dropdown select
- **checkbox** - Checkbox input
- **avatar** - User avatar display

### Feature Components

#### Navigation (`components/navigation/`)
- `Header.tsx` - Main navigation bar with auth buttons and cart
- `Footer.tsx` - Site footer with links
- `Navigation.tsx` - Mobile navigation menu

#### Authentication (`components/auth/`)
- `LoginModal.tsx` - Login form modal
- `SignupModal.tsx` - Registration form modal
- `ProtectedRoute.tsx` - Route guard for authentication
- `RoleProtectedRoute.tsx` - Route guard for role-based access

#### Artworks (`components/artworks/`)
- `ArtCard.tsx` - Artwork display card
- `ArtworkGrid.tsx` - Grid layout for artworks
- `ArtworkDetail.tsx` - Detailed artwork view
- `CustomizationPanel.tsx` - Print customization options

#### Cart (`components/features/cart/`)
- `Cart.tsx` - Cart display component
- `CartItem.tsx` - Individual cart item
- `CartSummary.tsx` - Order summary

#### Checkout (`components/features/checkout/`)
- `CheckoutForm.tsx` - Multi-step checkout form
- `DeliveryForm.tsx` - Delivery information form
- `OrderSummary.tsx` - Final order review

---

## 🗂 State Management

### Global State (React Context)

#### AuthContext
**Location:** `src/context/AuthContext.tsx`

Manages authentication state across the application:
- User authentication status
- User profile and roles
- Login/logout methods
- Session management
- Error handling

**Usage:**
```typescript
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated, loginWithEmail, logout } = useAuth();
```

#### CartContext
**Location:** `src/context/CartContext.tsx`

Manages shopping cart state:
- Cart items array
- Add/remove/update operations
- Cart item count
- Cart persistence

**Usage:**
```typescript
import { useCart } from './context/CartContext';

const { cartItems, addToCart, removeFromCart, cartItemCount } = useCart();
```

### Local State
- Component-level state using `useState`
- Form state management
- UI state (modals, dropdowns, etc.)

---

## 🛣 Routing & Navigation

### Route Configuration

**Location:** `src/App.tsx`

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />

  {/* Protected Routes */}
  <Route path="/artists" element={<ProtectedRoute><Artists /></ProtectedRoute>} />
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
  <Route path="/payment-status/:paymentId" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />

  {/* Role-Protected Routes */}
  <Route path="/artist-console" element={<RoleProtectedRoute allowedRoles={['artist']}><ArtistManagementConsole /></RoleProtectedRoute>} />
  <Route path="/print-shop" element={<RoleProtectedRoute allowedRoles={['printShop']}><PrintShop /></RoleProtectedRoute>} />
</Routes>
```

### Navigation Patterns

**Programmatic Navigation:**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/cart');
```

**Link Navigation:**
```typescript
import { Link } from 'react-router-dom';

<Link to="/artists">Browse Artists</Link>
```

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Use functional components with hooks
- Implement proper error handling
- Write descriptive component and variable names

### Component Guidelines
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement proper prop typing
- Add JSDoc comments for complex components

### State Management
- Use Context for global state (auth, cart)
- Use local state for component-specific data
- Avoid prop drilling - use Context when needed
- Keep state as close to where it's used as possible

### API Integration
- Centralize API calls in service modules
- Handle loading and error states
- Implement proper error messages
- Use TypeScript interfaces for API responses
- Add request/response logging for debugging

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use Shadcn/ui components for consistency
- Implement dark mode support (if needed)
- Keep inline styles minimal

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

## 🐛 Error Handling

### Error Boundary
**Location:** `src/ErrorBoundary.tsx`

Catches React component errors and displays fallback UI:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Error Handling
All service methods handle errors and throw descriptive messages:
```typescript
try {
  const data = await fetchArtworks();
} catch (error) {
  console.error('Failed to fetch artworks:', error);
  toast.error('Unable to load artworks. Please try again.');
}
```

### Authentication Errors
Handled in AuthContext with user-friendly messages:
- Invalid credentials
- Network errors
- Session expiration
- Role permission errors

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

## 📚 Additional Resources

### Firebase Documentation
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

### React & TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### UI Libraries
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

### Build Tools
- [Vite Documentation](https://vite.dev/)
- [React Router](https://reactrouter.com/)

---

## 🤝 Contributing

When contributing to this project:

1. Follow the established code style and patterns
2. Write descriptive commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure TypeScript types are properly defined
6. Add comments for complex logic

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Support

For questions or issues:
- Check existing documentation
- Review error messages and logs
- Contact the development team

---

**Built with ❤️ using React, TypeScript, and Firebase**
