# Auction Platform - Frontend Technical Specification

## Project Overview
This document provides technical specifications for building the frontend of an online auction platform using React, TypeScript, and Vite. It includes complete API integration details, data models, authentication flows, and implementation guidelines.

---

## Technology Stack

### Core Framework
- **React** 18+ with functional components and hooks
- **TypeScript** 5+ in strict mode
- **Vite** 5+ for build tooling

### UI Components
- **shadcn/ui** - All UI components MUST use shadcn/ui
- **Tailwind CSS** - For styling
- **Radix UI** - (underlying shadcn primitives)

### State Management
- **React Context API** or **Zustand** for global state
- **React Query (TanStack Query)** for server state management

### Routing
- **React Router v6** - Client-side routing

### Form Management
- **React Hook Form** - Form state and validation
- **Zod** - Schema validation

### HTTP Client
- **Axios** - API requests with interceptors

### Date/Time
- **date-fns** - Date manipulation and formatting

### Additional Libraries
- **clsx** / **cn** - Conditional classnames
- **lucide-react** - Icons

---

## Backend API Overview

### Base Configuration
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;
```

### Authentication
- **Type**: Bearer token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Token Storage**: localStorage or secure cookie
- **Token Refresh**: Automatic via refresh token endpoint

---

## API Endpoints Reference

### Authentication Endpoints

#### POST `/api/v1/auths/register`
**Purpose**: Register a new user

**Request Body**:
```typescript
interface RegisterFormDto {
  firstName: string;      // required
  lastName: string;       // required
  email: string;         // required, unique, email format
  password: string;      // required, min 8 characters
  phoneNumber?: string;  // optional
  birthday?: string;     // optional, ISO date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER'; // optional
}
```

**Response** (201):
```typescript
interface AuthResultDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picture?: string;
    role: 'USER' | 'ADMIN';
  };
}
```

---

#### POST `/api/v1/auths/login`
**Purpose**: Login with email and password

**Request Body**:
```typescript
interface LoginFormDto {
  email: string;
  password: string;
}
```

**Response** (200): Same as `AuthResultDto`

---

#### POST `/api/v1/auths/google`
**Purpose**: Login with Google OAuth

**Request Body**:
```typescript
interface GoogleTokenFormDto {
  idToken: string; // Google ID token
}
```

**Response** (200): Same as `AuthResultDto`

---

#### POST `/api/v1/auths/apple`
**Purpose**: Login with Apple

**Request Body**:
```typescript
interface AppleTokenFormDto {
  identityToken: string; // Apple identity token
  authorizationCode: string;
}
```

**Response** (200): Same as `AuthResultDto`

---

#### POST `/api/v1/auths/refresh-token`
**Purpose**: Refresh access token

**Request Body**:
```typescript
interface RefreshTokenFormDto {
  refreshToken: string;
}
```

**Response** (200): Same as `AuthResultDto`

---

#### GET `/api/v1/auths/me`
**Purpose**: Get current user information

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```typescript
interface CurrentUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  role: 'USER' | 'ADMIN';
  birthday?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### Item Endpoints

#### POST `/api/v1/items`
**Purpose**: Create a new auction item

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
interface CreateItemRequestDto {
  name: string;          // required, max 100 chars
  description: string;   // required
  startingPrice: number; // required, decimal
  startTime: string;     // required, ISO datetime
  endTime: string;       // required, ISO datetime (must be after startTime)
}
```

**Response** (201):
```typescript
interface ItemResponseDto {
  id: string;
  message: string; // e.g., "Item created successfully"
}
```

---

#### GET `/api/v1/items/non-bidded`
**Purpose**: Get items available for bidding (no bids yet or ongoing)

**Query Parameters**:
- `name?: string` - Filter by item name (partial match)
- `startingPriceFrom?: number` - Minimum starting price
- `startingPriceTo?: number` - Maximum starting price

**Response** (200):
```typescript
interface GetNonBiddedItemsResponseDto {
  items: Array<{
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    startTime: string;
    endTime: string;
    ownerId: string;
    ownerName: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

---

#### GET `/api/v1/items/:id`
**Purpose**: Get item details by ID

**Response** (200):
```typescript
interface GetItemByIdResponseDto {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  winnerId?: string;
  winnerName?: string;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
  bids: Array<{
    id: string;
    userId: string;
    userName: string;
    price: number;
    createdAt: string;
  }>;
  currentHighestBid?: number;
  bidCount: number;
  isActive: boolean; // computed: current time between startTime and endTime
  isLocked: boolean;
}
```

---

#### GET `/api/v1/items/:ownerId/owner`
**Purpose**: Get all items created by a specific user

**Response** (200):
```typescript
type GetItemsByOwnerIdResponseDto = Array<GetItemByIdResponseDto>;
```

---

#### PUT `/api/v1/items/:id`
**Purpose**: Update an existing item

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
interface UpdateItemRequestDto {
  name?: string;
  description?: string;
  startingPrice?: number;
  startTime?: string;
  endTime?: string;
}
```

**Response** (200):
```typescript
interface UpdateItemResponseDto {
  id: string;
  message: string;
}
```

**Business Rules**:
- Only item owner can update
- Cannot update if item has bids
- Cannot update if item is locked

---

#### PUT `/api/v1/items/:id/lock`
**Purpose**: Lock an item (prevent further bidding)

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```typescript
interface LockItemResponseDto {
  id: string;
  message: string;
}
```

**Business Rules**:
- Only item owner can lock
- Once locked, no more bids can be placed

---

#### GET `/api/v1/items/:userId/winning-bids`
**Purpose**: Get all items won by a user

**Response** (200):
```typescript
interface GetWinningBidsByUserIdResponseDto {
  items: Array<{
    id: string;
    name: string;
    description: string;
    finalPrice: number;
    endTime: string;
    ownerId: string;
    ownerName: string;
    winnerId: string;
    winnerName: string;
  }>;
}
```

---

#### GET `/api/v1/items/:userId/revenue`
**Purpose**: Get total revenue for item owner within date range

**Query Parameters** (required):
- `startDate: string` - ISO date format (e.g., "2023-01-01")
- `endDate: string` - ISO date format (e.g., "2023-12-31")

**Response** (200):
```typescript
interface GetRevenueByOwnerIdResponseDto {
  ownerId: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  itemsSold: number;
  items: Array<{
    id: string;
    name: string;
    startingPrice: number;
    finalPrice: number;
    profit: number;
    soldAt: string;
  }>;
}
```

---

#### GET `/api/v1/items/pdf/:id`
**Purpose**: Export item details as PDF

**Response** (200):
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="item-{id}.pdf"`
- **Body**: Binary PDF data

**Implementation**:
```typescript
async function downloadItemPdf(itemId: string) {
  const response = await axios.get(`/api/v1/items/pdf/${itemId}`, {
    responseType: 'blob',
  });
  
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `item-${itemId}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}
```

---

#### GET `/api/v1/items/:userId/winning-bids/pdf`
**Purpose**: Export user's winning bids as PDF

**Response** (200): Same as item PDF export

---

### Bid Endpoints

#### POST `/api/v1/bids`
**Purpose**: Place a bid on an item

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
interface PlaceBidOnItemRequestDto {
  itemId: string;  // required, UUID
  price: number;   // required, decimal (must be > current highest bid)
}
```

**Response** (201):
```typescript
interface BidResponseDto {
  id: string;
  message: string; // e.g., "Bid placed successfully"
}
```

**Business Rules**:
- User must be authenticated
- User cannot bid on their own item
- Bid price must be higher than current highest bid
- Item must be active (current time between start and end time)
- Item must not be locked
- User cannot bid if auction has ended

---

### User Endpoints

#### POST `/api/v1/users`
**Purpose**: Create a user (admin or system use)

**Request Body**:
```typescript
interface UserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}
```

**Response** (201):
```typescript
interface UserResponseDto {
  id: string;
  message: string;
}
```

---

## Frontend Data Models

### TypeScript Interfaces

```typescript
// types/auth.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  gender?: Gender;
  role: UserRole;
  birthday?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// types/item.ts
export interface Item {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  winnerId?: string;
  winnerName?: string;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
  bids: Bid[];
  currentHighestBid?: number;
  bidCount: number;
  isActive: boolean;
  isLocked: boolean;
}

export interface CreateItemForm {
  name: string;
  description: string;
  startingPrice: number;
  startTime: Date;
  endTime: Date;
}

export interface ItemFilters {
  name?: string;
  startingPriceFrom?: number;
  startingPriceTo?: number;
}

// types/bid.ts
export interface Bid {
  id: string;
  userId: string;
  userName: string;
  price: number;
  createdAt: string;
}

export interface PlaceBidForm {
  itemId: string;
  price: number;
}

// types/revenue.ts
export interface RevenueData {
  ownerId: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  itemsSold: number;
  items: SoldItem[];
}

export interface SoldItem {
  id: string;
  name: string;
  startingPrice: number;
  finalPrice: number;
  profit: number;
  soldAt: string;
}
```

---

## Form Validation Schemas (Zod)

```typescript
// schemas/auth.schemas.ts
import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phoneNumber: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// schemas/item.schemas.ts
export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  startingPrice: z.number()
    .positive('Starting price must be positive')
    .min(0.01, 'Minimum price is $0.01'),
  startTime: z.date(),
  endTime: z.date(),
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateItemSchema = createItemSchema.partial();

// schemas/bid.schemas.ts
export const placeBidSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  price: z.number().positive('Bid amount must be positive'),
});
```

---

## API Service Layer

### Axios Configuration

```typescript
// services/api.config.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = getStoredTokens();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post<AuthTokens>(
          `${API_BASE_URL}${API_PREFIX}/auths/refresh-token`,
          { refreshToken: tokens.refreshToken }
        );

        storeTokens(data);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Token storage helpers
function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem('auth_tokens');
  return stored ? JSON.parse(stored) : null;
}

function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

function clearStoredTokens(): void {
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('user');
}
```

---

### Auth Service

```typescript
// services/auth.service.ts
import { apiClient } from './api.config';
import { 
  RegisterFormDto, 
  LoginFormDto, 
  AuthResultDto,
  CurrentUserDto 
} from '@/types/auth';

export const authService = {
  async register(data: RegisterFormDto): Promise<AuthResultDto> {
    const response = await apiClient.post<AuthResultDto>('/auths/register', data);
    return response.data;
  },

  async login(data: LoginFormDto): Promise<AuthResultDto> {
    const response = await apiClient.post<AuthResultDto>('/auths/login', data);
    return response.data;
  },

  async googleLogin(idToken: string): Promise<AuthResultDto> {
    const response = await apiClient.post<AuthResultDto>('/auths/google', { idToken });
    return response.data;
  },

  async appleLogin(identityToken: string, authorizationCode: string): Promise<AuthResultDto> {
    const response = await apiClient.post<AuthResultDto>('/auths/apple', {
      identityToken,
      authorizationCode,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResultDto> {
    const response = await apiClient.post<AuthResultDto>('/auths/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<CurrentUserDto> {
    const response = await apiClient.get<CurrentUserDto>('/auths/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('user');
  },
};
```

---

### Item Service

```typescript
// services/item.service.ts
import { apiClient } from './api.config';
import { 
  Item, 
  CreateItemForm, 
  ItemFilters,
  RevenueData 
} from '@/types/item';

export const itemService = {
  async createItem(data: CreateItemForm): Promise<{ id: string; message: string }> {
    const payload = {
      ...data,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    };
    const response = await apiClient.post('/items', payload);
    return response.data;
  },

  async getItemById(id: string): Promise<Item> {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response.data;
  },

  async getNonBiddedItems(filters?: ItemFilters): Promise<Item[]> {
    const response = await apiClient.get<{ items: Item[] }>('/items/non-bidded', {
      params: filters,
    });
    return response.data.items;
  },

  async getItemsByOwnerId(ownerId: string): Promise<Item[]> {
    const response = await apiClient.get<Item[]>(`/items/${ownerId}/owner`);
    return response.data;
  },

  async updateItem(id: string, data: Partial<CreateItemForm>): Promise<{ id: string; message: string }> {
    const payload = {
      ...data,
      startTime: data.startTime?.toISOString(),
      endTime: data.endTime?.toISOString(),
    };
    const response = await apiClient.put(`/items/${id}`, payload);
    return response.data;
  },

  async lockItem(id: string): Promise<{ id: string; message: string }> {
    const response = await apiClient.put(`/items/${id}/lock`);
    return response.data;
  },

  async getWinningBids(userId: string): Promise<Item[]> {
    const response = await apiClient.get<{ items: Item[] }>(`/items/${userId}/winning-bids`);
    return response.data.items;
  },

  async getRevenue(userId: string, startDate: string, endDate: string): Promise<RevenueData> {
    const response = await apiClient.get<RevenueData>(`/items/${userId}/revenue`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async downloadItemPdf(itemId: string): Promise<void> {
    const response = await apiClient.get(`/items/pdf/${itemId}`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `item-${itemId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async downloadWinningBidsPdf(userId: string): Promise<void> {
    const response = await apiClient.get(`/items/${userId}/winning-bids/pdf`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `winning-bids-${userId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
```

---

### Bid Service

```typescript
// services/bid.service.ts
import { apiClient } from './api.config';
import { PlaceBidForm } from '@/types/bid';

export const bidService = {
  async placeBid(data: PlaceBidForm): Promise<{ id: string; message: string }> {
    const response = await apiClient.post('/bids', data);
    return response.data;
  },
};
```

---

## State Management (Zustand Example)

```typescript
// store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setTokens: (tokens) => set({ tokens }),
      
      logout: () => {
        authService.logout();
        set({ user: null, tokens: null, isAuthenticated: false });
      },
      
      checkAuth: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, tokens: state.tokens }),
    }
  )
);
```

---

## React Query Integration

```typescript
// hooks/useItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/item.service';
import { CreateItemForm, ItemFilters } from '@/types/item';
import { toast } from 'sonner';

export const useItems = (filters?: ItemFilters) => {
  return useQuery({
    queryKey: ['items', 'non-bidded', filters],
    queryFn: () => itemService.getNonBiddedItems(filters),
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemService.getItemById(id),
    refetchInterval: 5000, // Refresh every 5 seconds for live bid updates
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateItemForm) => itemService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create item');
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateItemForm> }) =>
      itemService.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update item');
    },
  });
};

export const useLockItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => itemService.lockItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['items', id] });
      toast.success('Item locked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to lock item');
    },
  });
};

// hooks/useBids.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bidService } from '@/services/bid.service';
import { PlaceBidForm } from '@/types/bid';
import { toast } from 'sonner';

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PlaceBidForm) => bidService.placeBid(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items', variables.itemId] });
      toast.success('Bid placed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to place bid';
      toast.error(message);
    },
  });
};
```

---

## Routing Setup

```typescript
// routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Layouts
import { RootLayout } from '@/layouts/RootLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { MarketplacePage } from '@/pages/marketplace/MarketplacePage';
import { ItemDetailPage } from '@/pages/items/ItemDetailPage';
import { CreateItemPage } from '@/pages/items/CreateItemPage';
import { EditItemPage } from '@/pages/items/EditItemPage';
import { MyItemsPage } from '@/pages/dashboard/MyItemsPage';
import { MyBidsPage } from '@/pages/dashboard/MyBidsPage';
import { WinningItemsPage } from '@/pages/dashboard/WinningItemsPage';
import { RevenuePage } from '@/pages/dashboard/RevenuePage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/marketplace" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'marketplace',
        element: <MarketplacePage />,
      },
      {
        path: 'items/:id',
        element: <ItemDetailPage />,
      },
      {
        path: 'items/create',
        element: (
          <ProtectedRoute>
            <CreateItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'items/:id/edit',
        element: (
          <ProtectedRoute>
            <EditItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/items" replace />,
          },
          {
            path: 'items',
            element: <MyItemsPage />,
          },
          {
            path: 'bids',
            element: <MyBidsPage />,
          },
          {
            path: 'winning',
            element: <WinningItemsPage />,
          },
          {
            path: 'revenue',
            element: <RevenuePage />,
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

---

## Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

---

## Utility Functions

```typescript
// utils/formatters.ts
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy at h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCountdown(endTime: string | Date): string {
  const now = new Date();
  const end = new Date(endTime);
  const seconds = differenceInSeconds(end, now);

  if (seconds <= 0) return 'Ended';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

// utils/validators.ts
export function isItemActive(startTime: string, endTime: string): boolean {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
}

export function canPlaceBid(
  item: Item,
  userId: string,
  bidAmount: number
): { canBid: boolean; reason?: string } {
  if (!isItemActive(item.startTime, item.endTime)) {
    return { canBid: false, reason: 'Auction is not active' };
  }

  if (item.isLocked) {
    return { canBid: false, reason: 'Item is locked' };
  }

  if (item.ownerId === userId) {
    return { canBid: false, reason: 'Cannot bid on your own item' };
  }

  const minBid = item.currentHighestBid 
    ? item.currentHighestBid + 0.01 
    : item.startingPrice;

  if (bidAmount < minBid) {
    return { 
      canBid: false, 
      reason: `Bid must be at least ${formatCurrency(minBid)}` 
    };
  }

  return { canBid: true };
}
```

---

## Custom Hooks

```typescript
// hooks/useCountdown.ts
import { useState, useEffect } from 'react';
import { formatCountdown } from '@/utils/formatters';

export function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState(formatCountdown(endTime));
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const formatted = formatCountdown(endTime);
      setTimeLeft(formatted);
      setIsEnded(formatted === 'Ended');
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return { timeLeft, isEnded };
}

// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Error Handling

```typescript
// utils/error-handler.ts
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown): void {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.errors) {
      // Handle validation errors
      Object.values(apiError.errors).forEach(messages => {
        messages.forEach(message => toast.error(message));
      });
    } else {
      toast.error(apiError?.message || 'An unexpected error occurred');
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
```

---

## Environment Variables

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── forms/           # Form components
│   ├── items/           # Item-related components
│   ├── bids/            # Bid-related components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts
├── pages/               # Route pages
│   ├── auth/
│   ├── marketplace/
│   ├── items/
│   ├── dashboard/
│   └── profile/
├── routes/              # Routing configuration
├── services/            # API services
├── store/               # State management
├── types/               # TypeScript types
├── utils/               # Utility functions
├── schemas/             # Zod validation schemas
├── lib/                 # External library configs
├── App.tsx
└── main.tsx
```

---

## Testing Considerations

### Unit Tests
- Test utility functions (formatters, validators)
- Test custom hooks with React Testing Library
- Test form validation schemas

### Integration Tests
- Test API service functions with mocked axios
- Test React Query hooks with QueryClient wrapper
- Test auth flow

### E2E Tests
- User registration and login flow
- Create item flow
- Place bid flow
- View winning items flow

---

## Performance Optimizations

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const ItemDetailPage = lazy(() => import('@/pages/items/ItemDetailPage'));

<Suspense fallback={<Loading />}>
  <ItemDetailPage />
</Suspense>
```

### Memoization
```typescript
import { useMemo } from 'react';

const sortedItems = useMemo(() => {
  return items.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}, [items]);
```

### Virtualization
For long lists of items, use `@tanstack/react-virtual`:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Security Best Practices

1. **Token Storage**: Use httpOnly cookies if possible, otherwise localStorage with XSS protection
2. **CORS**: Configure backend to only accept requests from allowed origins
3. **Input Sanitization**: Validate and sanitize all user inputs
4. **HTTPS**: Use HTTPS in production
5. **Rate Limiting**: Implement on critical endpoints (login, bid placement)
6. **CSP Headers**: Configure Content Security Policy

---

## Deployment Checklist

- [ ] Set up environment variables
- [ ] Configure HTTPS
- [ ] Enable production optimizations (minification, tree-shaking)
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Implement caching strategies
- [ ] Set up CI/CD pipeline
- [ ] Run lighthouse audit
- [ ] Test on multiple browsers and devices
- [ ] Set up monitoring and analytics

---

## Common Pitfalls & Solutions

### Problem: Token expiry during user session
**Solution**: Implement automatic token refresh with interceptors (already shown above)

### Problem: Stale data in item detail page
**Solution**: Use React Query's `refetchInterval` for live updates

### Problem: Race conditions when placing bids
**Solution**: Optimistic updates with React Query + proper error handling

### Problem: Large bundle size
**Solution**: Code splitting, lazy loading, and tree-shaking unused dependencies

### Problem: Slow image loading
**Solution**: Implement lazy loading, image optimization, and blur placeholders

---

This specification provides complete implementation guidance for integrating with the auction platform backend. Use it in combination with the UI Design Requirements document for full frontend development.
