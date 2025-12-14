# Hướng Dẫn Xây Dựng Auction Platform Frontend

## 📋 Tổng Quan

Đây là hướng dẫn chi tiết để xây dựng frontend của nền tảng đấu giá trực tuyến. Khi thực hiện bất kỳ task nào liên quan đến dự án này, **BẮT BUỘC** phải tuân thủ các quy tắc và tiêu chuẩn sau.

---

## 📚 Tài Liệu Tham Chiếu Bắt Buộc

### 1. FRONTEND-TECHNICAL-SPEC.md - Tài Liệu Kỹ Thuật Chính
**Vai trò**: Đây là nguồn chân lý duy nhất (single source of truth) cho mọi quyết định kỹ thuật.

**Nội dung quan trọng cần nắm**:
- ✅ **Technology Stack** (dòng 10-46): React 18+, TypeScript 5+, Vite 5+, shadcn/ui, Tailwind CSS, React Query, Zustand, React Router v6, React Hook Form, Zod, Axios, date-fns
- ✅ **API Endpoints** (dòng 64-461): Tất cả endpoint với request/response schema chi tiết
- ✅ **TypeScript Interfaces** (dòng 480-580): Data models cho User, Item, Bid, Revenue
- ✅ **Zod Schemas** (dòng 582-632): Form validation schemas
- ✅ **API Service Layer** (dòng 638-900): Axios configuration với token refresh interceptors
- ✅ **State Management** (dòng 902-950): Zustand store patterns
- ✅ **React Query Integration** (dòng 962-1047): Custom hooks cho data fetching
- ✅ **Routing Setup** (dòng 1054-1161): React Router configuration
- ✅ **Project Structure** (dòng 1385-1412): Folder organization chuẩn

**Quy tắc**:
- ⚠️ KHÔNG được tự ý thay đổi API contract, request/response format
- ⚠️ PHẢI sử dụng CHÍNH XÁC các TypeScript interfaces đã định nghĩa
- ⚠️ PHẢI implement Axios interceptors cho token refresh như spec
- ⚠️ PHẢI follow project structure đã được định nghĩa

### 2. stitch_sign_up_page/ - Design Reference (Tham Khảo)
**Vai trò**: ⚠️ **CHỈ MANG TÍNH THAM KHẢO** - Cung cấp ý tưởng về design system, layout patterns, và UI structure.

**⚠️ LƯU Ý QUAN TRỌNG**:
- **KHÔNG** copy nguyên xi HTML sang React
- **KHÔNG** giữ nguyên structure không thống nhất trong HTML
- **PHẢI** phân tích và tách thành các component nhỏ, có thể tái sử dụng
- **PHẢI** đảm bảo components nhất quán về naming, props, và behavior

**Các file HTML tham khảo**:
- `sign_up_page/code.html` → Tham khảo flow đăng ký multi-step
- `login_page/code.html` → Tham khảo login form layout
- `browse_items_(marketplace)/code.html` → Tham khảo grid layout, filters
- `item_detail_page/code.html` → Tham khảo item display, bid form
- `create_item_page/code.html` → Tham khảo form structure
- `edit_item_page/code.html` → Tham khảo edit form
- `my_items_dashboard/code.html` → Tham khảo table layout
- `my_bids_dashboard/code.html` → Tham khảo bid listing
- `winning_bids_page/code.html` → Tham khảo winning items display
- `revenue_dashboard/code.html` → Tham khảo stats cards, charts
- `user_profile_page/code.html` → Tham khảo profile layout
- `settings_page/code.html` → Tham khảo settings tabs
- `main_header/navbar*/code.html` → Tham khảo navigation structure
- `footer/code.html` → Tham khảo footer links
- `404_error_page/code.html` → Tham khảo error page

**Design System cần tuân thủ** (extract từ HTML templates):
- 🎨 Primary Color: `#256af4` (blue)
- 🎨 Dark mode optimized (background: dark grays, text: white/gray)
- 🎨 Font: Manrope
- 🎨 Icons: Material Symbols → convert sang lucide-react
- 🎨 Responsive: Mobile-first approach
- 🎨 Tailwind CSS cho styling

---

## 🛠️ Technology Stack - BẮT BUỘC

### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.6.2",
  "vite": "^6.0.1"
}
```

### UI & Styling (BẮT BUỘC dùng shadcn/ui)
```json
{
  "@radix-ui/*": "latest",
  "tailwindcss": "^4.0.0",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "lucide-react": "latest"
}
```

### State Management
```json
{
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.0.0"
}
```

### Routing & Forms
```json
{
  "react-router-dom": "^6.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0"
}
```

### HTTP & Utilities
```json
{
  "axios": "^1.0.0",
  "date-fns": "^3.0.0",
  "sonner": "latest"
}
```

**Quy tắc**:
- ⚠️ TẤT CẢ UI components PHẢI dùng shadcn/ui, KHÔNG được dùng Material-UI, Ant Design, Chakra UI, etc.
- ⚠️ Server state (API data) PHẢI dùng React Query
- ⚠️ Global state (auth) PHẢI dùng Zustand
- ⚠️ Form validation PHẢI dùng React Hook Form + Zod
- ⚠️ Icons PHẢI dùng lucide-react (convert từ Material Symbols trong HTML)

---

## 📐 Implementation Workflow - Thứ Tự Thực Hiện

### Phase 1: Setup Dependencies
```bash
# 1. Install core dependencies
npm install react-router-dom @tanstack/react-query zustand axios react-hook-form zod date-fns sonner

# 2. Initialize shadcn/ui
npx shadcn@latest init

# 3. Install shadcn components cần thiết
npx shadcn@latest add button input label card form dialog select textarea checkbox radio-group separator badge avatar dropdown-menu table toast
```

### Phase 2: Project Structure
Tạo folder structure theo FRONTEND-TECHNICAL-SPEC.md (dòng 1385-1412):
```
src/
├── components/
│   ├── ui/              # shadcn components (auto-generated)
│   ├── forms/           # Reusable form components
│   ├── items/           # Item-related components (ItemCard, ItemList, etc.)
│   ├── bids/            # Bid-related components
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   └── auth/            # Auth-related components
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts (RootLayout, DashboardLayout)
├── pages/               # Route pages
│   ├── auth/            # LoginPage, RegisterPage
│   ├── marketplace/     # MarketplacePage
│   ├── items/           # ItemDetailPage, CreateItemPage, EditItemPage
│   ├── dashboard/       # MyItemsPage, MyBidsPage, WinningItemsPage, RevenuePage
│   └── profile/         # ProfilePage, SettingsPage
├── routes/              # Routing configuration
├── services/            # API services (auth, item, bid)
├── store/               # Zustand stores (auth.store.ts)
├── types/               # TypeScript types (auth.ts, item.ts, bid.ts)
├── utils/               # Utility functions (formatters.ts, validators.ts, error-handler.ts)
├── schemas/             # Zod validation schemas
└── lib/                 # External library configs
```

### Phase 3: Core Infrastructure
**Thứ tự implement**:

1. **Environment Variables** (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

2. **TypeScript Types** (`src/types/`)
   - Copy CHÍNH XÁC interfaces từ FRONTEND-TECHNICAL-SPEC.md (dòng 480-580)
   - `auth.ts`, `item.ts`, `bid.ts`, `revenue.ts`

3. **Zod Schemas** (`src/schemas/`)
   - Copy CHÍNH XÁC schemas từ FRONTEND-TECHNICAL-SPEC.md (dòng 582-632)
   - `auth.schemas.ts`, `item.schemas.ts`, `bid.schemas.ts`

4. **Axios Configuration** (`src/services/api.config.ts`)
   - Copy CHÍNH XÁC code từ FRONTEND-TECHNICAL-SPEC.md (dòng 638-720)
   - PHẢI implement token refresh interceptors

5. **API Services** (`src/services/`)
   - `auth.service.ts` - Copy từ spec (dòng 722-773)
   - `item.service.ts` - Copy từ spec (dòng 781-876)
   - `bid.service.ts` - Copy từ spec (dòng 884-896)

6. **Zustand Store** (`src/store/auth.store.ts`)
   - Copy từ spec (dòng 902-950)
   - Persist auth state với zustand/middleware

7. **React Query Setup** (`src/App.tsx` or `src/main.tsx`)
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

8. **React Query Hooks** (`src/hooks/`)
   - `useItems.ts` - Copy từ spec (dòng 962-1010)
   - `useBids.ts` - Copy từ spec (dòng 1028-1047)
   - `useAuth.ts` - Similar pattern

9. **Utility Functions** (`src/utils/`)
   - `formatters.ts` - Copy từ spec (dòng 1199-1237)
   - `validators.ts` - Copy từ spec (dòng 1239-1276)
   - `error-handler.ts` - Copy từ spec (dòng 1330-1367)

10. **Custom Hooks** (`src/hooks/`)
    - `useCountdown.ts` - Copy từ spec (dòng 1285-1303)
    - `useDebounce.ts` - Copy từ spec (dòng 1308-1322)

### Phase 4: Routing & Layouts

1. **Protected Route** (`src/components/auth/ProtectedRoute.tsx`)
   - Copy từ spec (dòng 1173-1191)

2. **Layouts** (`src/layouts/`)
   - `RootLayout.tsx` - Header + Footer + Outlet
   - `DashboardLayout.tsx` - Sidebar + Content area
   - Reference HTML từ `dashboard_layout/code.html` và `main_header/navbar*/code.html`

3. **Router Configuration** (`src/routes/index.tsx`)
   - Copy structure từ spec (dòng 1074-1161)
   - Customize routes theo requirements

### Phase 5: Pages Implementation
**Thứ tự ưu tiên**:

1. **Auth Pages** (High Priority)
   - `LoginPage.tsx` - Reference: `login_page/code.html`
     - API: POST `/api/v1/auths/login`
     - Zod: `loginSchema`
     - shadcn: Form, Input, Button, Card
     - Google/Apple OAuth buttons
   
   - `RegisterPage.tsx` - Reference: `sign_up_page/code.html`
     - API: POST `/api/v1/auths/register`
     - Zod: `registerSchema`
     - Multi-step form with progress indicator
     - Gender select, birthday picker

2. **Marketplace** (High Priority)
   - `MarketplacePage.tsx` - Reference: `browse_items_(marketplace)/code.html`
     - API: GET `/api/v1/items/non-bidded`
     - Filters: name, price range
     - Grid layout với ItemCard components
     - Search, sorting, pagination
     - Live auction badges
     - shadcn: Input, Select, Card, Badge

3. **Item Pages** (High Priority)
   - `ItemDetailPage.tsx` - Reference: `item_detail_page/code.html`
     - API: GET `/api/v1/items/:id`, POST `/api/v1/bids`
     - Countdown timer (useCountdown hook)
     - Bid placement form
     - Bid history list
     - Owner actions (lock item)
     - shadcn: Card, Button, Dialog, Badge
   
   - `CreateItemPage.tsx` - Reference: `create_item_page/code.html`
     - API: POST `/api/v1/items`
     - Zod: `createItemSchema`
     - DateTime pickers
     - Image upload (if applicable)
     - shadcn: Form, Input, Textarea, DatePicker
   
   - `EditItemPage.tsx` - Reference: `edit_item_page/code.html`
     - API: PUT `/api/v1/items/:id`
     - Pre-fill form với existing data
     - Disable if item has bids

4. **Dashboard Pages** (Medium Priority)
   - `MyItemsPage.tsx` - Reference: `my_items_dashboard/code.html`
     - API: GET `/api/v1/items/:ownerId/owner`
     - Table view với status badges
     - Actions: Edit, Lock, View
     - shadcn: Table, Badge, DropdownMenu
   
   - `MyBidsPage.tsx` - Reference: `my_bids_dashboard/code.html`
     - Show user's active bids
     - Bid status (winning/outbid)
     - shadcn: Table, Badge
   
   - `WinningItemsPage.tsx` - Reference: `winning_bids_page/code.html`
     - API: GET `/api/v1/items/:userId/winning-bids`
     - PDF export button
     - shadcn: Table, Button, Dialog
   
   - `RevenuePage.tsx` - Reference: `revenue_dashboard/code.html`
     - API: GET `/api/v1/items/:userId/revenue`
     - Date range picker
     - Revenue chart (optional: recharts)
     - Sold items table
     - shadcn: DateRangePicker, Table, Card

5. **Profile Pages** (Low Priority)
   - `ProfilePage.tsx` - Reference: `user_profile_page/code.html`
     - API: GET `/api/v1/auths/me`
     - Display user info
     - Avatar upload
     - shadcn: Avatar, Card, Separator
   
   - `SettingsPage.tsx` - Reference: `settings_page/code.html`
     - Update user preferences
     - Change password
     - shadcn: Form, Tabs, Switch

6. **Other Pages**
   - `NotFoundPage.tsx` - Reference: `404_error_page/code.html`

---

## 🧩 Component Design Principles

### Atomic Design Approach
**BẮT BUỘC** áp dụng Atomic Design để tổ chức components:

```
Atoms (Smallest units)
├── Button variants (PrimaryButton, SecondaryButton, IconButton)
├── Input variants (TextInput, NumberInput, DateInput)
├── Typography (Heading, Text, Label)
├── Icon wrappers
└── Badges, Avatars, Spinners

Molecules (Simple combinations)
├── FormField (Label + Input + Error)
├── SearchBox (Input + Icon + Button)
├── PriceDisplay (Icon + Formatted Price)
├── CountdownTimer (Icon + Time Display)
└── StatusBadge (Icon + Text + Color)

Organisms (Complex components)
├── ItemCard (Image + Title + Price + Status + Actions)
├── BidForm (FormFields + Validation + Submit)
├── ItemFilters (SearchBox + Selects + Range Inputs)
├── DataTable (Headers + Rows + Pagination)
└── NavigationBar (Logo + Menu + UserMenu)

Templates (Page layouts)
├── RootLayout (Header + Footer + Content)
├── DashboardLayout (Sidebar + Content)
└── AuthLayout (Centered Form + Background)

Pages (Complete views)
├── LoginPage, RegisterPage
├── MarketplacePage, ItemDetailPage
└── Dashboard pages
```

### Component Reusability Rules

✅ **DO**:
```typescript
// ✅ GOOD: Reusable, configurable component
export function PriceDisplay({ 
  amount, 
  currency = 'USD',
  showIcon = true,
  size = 'md',
  className 
}: PriceDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && <DollarSign className="h-4 w-4" />}
      <span className={sizeClasses[size]}>
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );
}

// ✅ GOOD: Reuse across multiple places
<PriceDisplay amount={item.currentPrice} />
<PriceDisplay amount={bid.price} showIcon={false} size="lg" />
```

❌ **DON'T**:
```typescript
// ❌ BAD: Hardcoded, non-reusable
export function ItemPrice({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-2">
      <DollarSign className="h-4 w-4" />
      <span className="text-lg font-bold">
        ${item.currentPrice.toFixed(2)}
      </span>
    </div>
  );
}

// ❌ BAD: Duplicate code
export function BidPrice({ bid }: { bid: Bid }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">
        ${bid.price.toFixed(2)}
      </span>
    </div>
  );
}
```

### DRY Principle (Don't Repeat Yourself)

**PHẢI tách code lặp lại thành components/utils**:

```typescript
// ❌ BAD: Repeated code trong multiple pages
function MarketplacePage() {
  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;
  // ...
}

function ItemDetailPage() {
  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;
  // ...
}

// ✅ GOOD: Extract thành reusable components
function LoadingState() {
  return <div className="flex justify-center p-8"><Spinner /></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="text-red-500 p-4">Error: {message}</div>;
}

// Hoặc HOC/wrapper component
function QueryWrapper({ 
  isLoading, 
  error, 
  children 
}: QueryWrapperProps) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  return <>{children}</>;
}
```

### Component Composition Pattern

```typescript
// ✅ GOOD: Compound component pattern
export function ItemCard({ item }: { item: Item }) {
  return (
    <Card>
      <ItemCard.Image src={item.image} alt={item.name} />
      <ItemCard.Content>
        <ItemCard.Title>{item.name}</ItemCard.Title>
        <ItemCard.Description>{item.description}</ItemCard.Description>
        <ItemCard.Footer>
          <PriceDisplay amount={item.currentPrice} />
          <StatusBadge status={item.status} />
        </ItemCard.Footer>
      </ItemCard.Content>
    </Card>
  );
}

ItemCard.Image = ({ src, alt }: ImageProps) => (...);
ItemCard.Content = ({ children }: ContentProps) => (...);
ItemCard.Title = ({ children }: TitleProps) => (...);
ItemCard.Description = ({ children }: DescriptionProps) => (...);
ItemCard.Footer = ({ children }: FooterProps) => (...);
```

### Component File Organization

```typescript
// components/items/ItemCard/index.tsx
export { ItemCard } from './ItemCard';
export type { ItemCardProps } from './ItemCard.types';

// components/items/ItemCard/ItemCard.tsx
import { ItemCardProps } from './ItemCard.types';
import { ItemCardImage } from './ItemCardImage';
import { ItemCardContent } from './ItemCardContent';

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card>
      <ItemCardImage src={item.image} />
      <ItemCardContent item={item} />
    </Card>
  );
}

// components/items/ItemCard/ItemCard.types.ts
export interface ItemCardProps {
  item: Item;
  onBidClick?: () => void;
  showActions?: boolean;
}
```

### Tránh Code Rác (Code Smell Detection)

❌ **Code Smells cần tránh**:
1. **Magic Numbers**: `className="p-4 mt-8 mb-12"` → Define spacing constants
2. **Inline Styles**: `style={{ color: '#256af4' }}` → Use Tailwind classes or CSS variables
3. **Deep Nesting**: `<div><div><div><div>...` → Extract sub-components
4. **Long Components**: >200 lines → Split into smaller components
5. **Prop Drilling**: Passing props through 3+ levels → Use Context/Zustand
6. **Duplicate Logic**: Same code in 2+ places → Extract to utility/hook

✅ **Clean Code Practices**:
```typescript
// Constants file
export const SPACING = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

export const COLORS = {
  primary: '#256af4',
  background: '#1a1a1a',
  card: '#242424',
} as const;

// Component usage
<Card className={cn(SPACING.md, 'bg-card')} />
```

---

## 🎨 HTML-to-React Conversion Guidelines

### Phân Tích Trước Khi Code

**Quy trình bắt buộc**:
1. **Đọc HTML template** → Hiểu structure và flow
2. **Identify patterns** → Tìm các phần lặp lại (cards, forms, lists)
3. **Sketch component tree** → Vẽ sơ đồ component hierarchy
4. **Define reusable components** → List các components cần tạo
5. **Code từ nhỏ đến lớn** → Atoms → Molecules → Organisms → Pages

**Ví dụ phân tích `browse_items_(marketplace)/code.html`**:
```
MarketplacePage (Page)
├── PageHeader (Organism)
│   ├── Heading (Atom)
│   └── Breadcrumb (Molecule)
├── MarketplaceFilters (Organism)
│   ├── SearchBox (Molecule: Input + Icon)
│   ├── PriceRangeFilter (Molecule: 2x NumberInput)
│   └── SortSelect (Molecule: Select + Label)
└── ItemGrid (Organism)
    ├── ItemCard (Organism) → Reuse!
    │   ├── ItemImage (Molecule)
    │   ├── ItemInfo (Molecule)
    │   │   ├── ItemTitle (Atom)
    │   │   ├── PriceDisplay (Molecule) → Reuse!
    │   │   └── StatusBadge (Molecule) → Reuse!
    │   └── ItemActions (Molecule)
    │       └── Button (Atom) → Reuse!
    └── Pagination (Molecule)
```

### Icon Conversion: Material Symbols → lucide-react
Mapping phổ biến:
```typescript
// Material Symbols → lucide-react
"search" → <Search />
"person" → <User />
"shopping_cart" → <ShoppingCart />
"favorite" → <Heart />
"settings" → <Settings />
"logout" → <LogOut />
"add" → <Plus />
"edit" → <Edit />
"delete" → <Trash2 />
"visibility" → <Eye />
"close" → <X />
"check" → <Check />
"arrow_forward" → <ArrowRight />
"arrow_back" → <ArrowLeft />
"calendar_today" → <Calendar />
"attach_money" → <DollarSign />
"lock" → <Lock />
"timer" → <Clock />
```

### Tailwind Classes → shadcn Components
**KHÔNG** convert mọi thứ sang props, giữ Tailwind classes:
```tsx
// ❌ WRONG
<Button variant="primary" size="large" rounded />

// ✅ CORRECT
<Button className="bg-[#256af4] hover:bg-[#1e5dd9] text-white px-6 py-3 rounded-lg">
  Submit
</Button>
```

### Component Extraction Strategy

**Quy tắc extract components**:
1. **Identify repeating patterns** - Nếu xuất hiện 2+ lần → Component
2. **Logical grouping** - Nhóm UI elements có liên quan → Component
3. **Single responsibility** - Mỗi component làm 1 việc rõ ràng
4. **Reasonable size** - 50-150 lines code per component (ideal)

**Components CẦN TẠO** (theo thứ tự ưu tiên):

**Atoms (Base Components)**:
1. `Button` - Primary, secondary, outline, ghost variants
2. `Input` - Text, number, email, password types
3. `Label` - Form labels with optional asterisk
4. `Badge` - Status indicators (active, ended, locked)
5. `Avatar` - User profile images
6. `Spinner` - Loading indicator
7. `Icon` - Wrapper cho lucide-react icons

**Molecules (Simple Composites)**:
8. `FormField` - Label + Input + Error message wrapper
9. `SearchBox` - Input với search icon và clear button
10. `PriceDisplay` - Icon + formatted currency (⭐ REUSE nhiều)
11. `CountdownTimer` - Clock icon + time remaining (⭐ REUSE nhiều)
12. `StatusBadge` - Colored badge với icon (⭐ REUSE nhiều)
13. `UserAvatar` - Avatar + name + optional role
14. `EmptyState` - Icon + message khi no data
15. `ErrorMessage` - Styled error display

**Organisms (Complex Components)**:
16. `ItemCard` - Card hiển thị item (marketplace, dashboard)
17. `BidCard` - Card hiển thị bid history
18. `BidForm` - Form place bid với validation
19. `ItemFilters` - Sidebar filters (search, price range, sort)
20. `DataTable` - Reusable table với sorting, pagination
21. `NavigationBar` - Header với logo, menu, user dropdown
22. `Footer` - Footer với links và social media
23. `Sidebar` - Dashboard sidebar navigation
24. `StatsCard` - Card hiển thị statistics (revenue dashboard)

**Example: PriceDisplay Component** (REUSE across 10+ places):
```typescript
// components/ui/PriceDisplay.tsx
export interface PriceDisplayProps {
  amount: number;
  currency?: 'USD' | 'EUR' | 'VND';
  showIcon?: boolean;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({
  amount,
  currency = 'USD',
  showIcon = true,
  showCurrency = true,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showIcon && <DollarSign className="h-4 w-4 text-green-500" />}
      <span className={sizeClasses[size]}>
        {formatCurrency(amount, currency, showCurrency)}
      </span>
    </div>
  );
}

// Usage examples:
<PriceDisplay amount={item.startingPrice} /> // Marketplace
<PriceDisplay amount={bid.price} showIcon={false} size="lg" /> // Bid form
<PriceDisplay amount={revenue.total} size="lg" /> // Revenue dashboard
```

### Dark Mode Preservation
HTML templates đã có dark mode, giữ nguyên:
```tsx
// Background colors
className="bg-[#1a1a1a]"  // Main background
className="bg-[#242424]"  // Card background
className="bg-[#2a2a2a]"  // Hover state

// Text colors
className="text-white"     // Primary text
className="text-gray-400"  // Secondary text
className="text-gray-500"  // Muted text

// Primary color
className="bg-[#256af4]"   // Buttons, links
```

### Responsive Design
Giữ mobile-first approach từ HTML:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## 🔌 API Integration Requirements

### Endpoint Implementation Checklist
Cho MỖI endpoint, phải implement:

✅ **TypeScript Interface** cho request & response (từ spec)
✅ **Service Function** trong `src/services/` (axios call)
✅ **React Query Hook** trong `src/hooks/` (useMutation hoặc useQuery)
✅ **Error Handling** với toast notifications (sonner)
✅ **Loading States** (React Query's isLoading)
✅ **Optimistic Updates** cho mutations (nếu applicable)

### Example: Place Bid Flow
```typescript
// 1. Type (src/types/bid.ts)
export interface PlaceBidForm {
  itemId: string;
  price: number;
}

// 2. Schema (src/schemas/bid.schemas.ts)
export const placeBidSchema = z.object({
  itemId: z.string().uuid(),
  price: z.number().positive(),
});

// 3. Service (src/services/bid.service.ts)
export const bidService = {
  async placeBid(data: PlaceBidForm) {
    const response = await apiClient.post('/bids', data);
    return response.data;
  },
};

// 4. Hook (src/hooks/useBids.ts)
export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bidService.placeBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Bid placed successfully!');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// 5. Component Usage (ItemDetailPage.tsx)
const { mutate: placeBid, isPending } = usePlaceBid();

const handleSubmit = (data: PlaceBidForm) => {
  placeBid(data);
};
```

### Token Refresh Flow
PHẢI implement theo spec (dòng 665-701):
- Intercept 401 responses
- Call POST `/api/v1/auths/refresh-token`
- Retry failed request với new token
- Logout nếu refresh fails

---

## ✅ Code Quality Standards

### TypeScript
```typescript
// ✅ MUST: Strict mode enabled
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// ✅ MUST: Explicit types
interface Props {
  itemId: string;
  onClose: () => void;
}

// ❌ AVOID: Any types
const data: any = response.data; // BAD
```

### Error Handling
```typescript
// ✅ MUST: Try-catch trong async functions
try {
  await itemService.createItem(data);
  toast.success('Item created!');
} catch (error) {
  handleApiError(error); // Centralized error handler
}

// ✅ MUST: Show user-friendly error messages
toast.error('Failed to create item. Please try again.');
```

### Accessibility
```tsx
// ✅ MUST: Semantic HTML
<button type="submit" aria-label="Submit bid">Place Bid</button>

// ✅ MUST: Form labels
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// ✅ MUST: Loading states
{isLoading ? <Spinner aria-label="Loading..." /> : <Content />}
```

### Performance
```typescript
// ✅ DO: Code splitting
const ItemDetailPage = lazy(() => import('@/pages/items/ItemDetailPage'));

// ✅ DO: Memoization cho expensive computations
const sortedItems = useMemo(() => 
  items.sort((a, b) => b.currentPrice - a.currentPrice),
  [items]
);

// ✅ DO: Debounce search inputs
const debouncedSearch = useDebounce(searchTerm, 300);
```

### File Naming
```
// Components: PascalCase
ItemCard.tsx
MarketplacePage.tsx

// Hooks: camelCase with 'use' prefix
useItems.ts
useCountdown.ts

// Services: camelCase with '.service' suffix
auth.service.ts
item.service.ts

// Types: camelCase with '.ts' suffix
auth.ts
item.ts

// Utils: camelCase
formatters.ts
validators.ts
```

---

## 🚨 Common Pitfalls & Solutions

### 1. Token Expiry
**Problem**: User bị logged out giữa chừng session
**Solution**: Implement token refresh interceptors (FRONTEND-TECHNICAL-SPEC.md dòng 665-701)

### 2. Stale Data
**Problem**: Item detail page không update khi có bid mới
**Solution**: 
```typescript
// Enable refetch on interval cho real-time updates
useQuery({
  queryKey: ['item', id],
  queryFn: () => itemService.getById(id),
  refetchInterval: 5000, // 5 seconds
});
```

### 3. Race Conditions
**Problem**: User click "Place Bid" nhiều lần
**Solution**:
```typescript
<Button disabled={isPending}>
  {isPending ? 'Placing Bid...' : 'Place Bid'}
</Button>
```

### 4. Form Validation
**Problem**: Backend trả về validation errors khác client
**Solution**: Implement proper error handling
```typescript
onError: (error: AxiosError<ApiError>) => {
  if (error.response?.data?.errors) {
    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
      form.setError(field, { message: messages[0] });
    });
  }
}
```

### 5. Large Bundle Size
**Problem**: Initial load quá chậm
**Solution**:
```typescript
// Lazy load pages
const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
const ItemDetailPage = lazy(() => import('@/pages/items/ItemDetailPage'));

// Use in router
<Route path="/marketplace" element={
  <Suspense fallback={<PageLoader />}>
    <MarketplacePage />
  </Suspense>
} />
```

---

## 📝 Page-by-Page Implementation Mapping

| HTML Template | React Component | API Endpoints | Key Features |
|--------------|-----------------|---------------|--------------|
| `sign_up_page/code.html` | `RegisterPage.tsx` | POST `/api/v1/auths/register` | Multi-step form, social auth, gender select, birthday picker |
| `login_page/code.html` | `LoginPage.tsx` | POST `/api/v1/auths/login`, POST `/api/v1/auths/google`, POST `/api/v1/auths/apple` | Email/password, Google OAuth, Apple OAuth, remember me |
| `browse_items_(marketplace)/code.html` | `MarketplacePage.tsx` | GET `/api/v1/items/non-bidded` | Filters, search, sorting, pagination, item grid |
| `item_detail_page/code.html` | `ItemDetailPage.tsx` | GET `/api/v1/items/:id`, POST `/api/v1/bids` | Countdown timer, bid form, bid history, lock button |
| `create_item_page/code.html` | `CreateItemPage.tsx` | POST `/api/v1/items` | Form validation, datetime pickers, image upload |
| `edit_item_page/code.html` | `EditItemPage.tsx` | GET `/api/v1/items/:id`, PUT `/api/v1/items/:id` | Pre-fill form, conditional disable |
| `my_items_dashboard/code.html` | `MyItemsPage.tsx` | GET `/api/v1/items/:ownerId/owner` | Table view, status badges, actions dropdown |
| `my_bids_dashboard/code.html` | `MyBidsPage.tsx` | Custom endpoint or filter items | Active bids table, winning status |
| `winning_bids_page/code.html` | `WinningItemsPage.tsx` | GET `/api/v1/items/:userId/winning-bids`, GET `/api/v1/items/:userId/winning-bids/pdf` | Won items table, PDF export |
| `revenue_dashboard/code.html` | `RevenuePage.tsx` | GET `/api/v1/items/:userId/revenue` | Date range filter, revenue stats, sold items table |
| `user_profile_page/code.html` | `ProfilePage.tsx` | GET `/api/v1/auths/me` | User info display, avatar, stats |
| `settings_page/code.html` | `SettingsPage.tsx` | PUT `/api/v1/users` (if available) | Preferences, password change |
| `dashboard_layout/code.html` | `DashboardLayout.tsx` | - | Sidebar navigation, content area |
| `main_header/navbar*/code.html` | `Header.tsx`, `Navbar.tsx` | - | Logo, navigation, user menu, search |
| `footer/code.html` | `Footer.tsx` | - | Links, copyright, social media |
| `404_error_page/code.html` | `NotFoundPage.tsx` | - | Error message, back to home |

---

## 🎯 Implementation Priorities

### Phase 1: Core (Week 1)
- ✅ Setup dependencies & shadcn/ui
- ✅ Project structure
- ✅ Types, schemas, services
- ✅ Zustand auth store
- ✅ React Query setup
- ✅ Routing configuration
- ✅ Auth pages (Login, Register)

### Phase 2: Main Features (Week 2)
- ✅ Marketplace page
- ✅ Item detail page
- ✅ Create/Edit item pages
- ✅ Bid placement functionality
- ✅ Layouts (Header, Footer, Dashboard)

### Phase 3: Dashboard (Week 3)
- ✅ My Items dashboard
- ✅ My Bids dashboard
- ✅ Winning Items page
- ✅ Revenue dashboard
- ✅ PDF export functionality

### Phase 4: Polish (Week 4)
- ✅ Profile & Settings pages
- ✅ Error handling improvements
- ✅ Loading states & skeletons
- ✅ Responsive design refinements
- ✅ Performance optimizations
- ✅ Accessibility audit
- ✅ Testing

---

## 🔒 Security Checklist

- ✅ Store JWT tokens in localStorage (or httpOnly cookies if possible)
- ✅ Implement CSRF protection
- ✅ Sanitize all user inputs before rendering
- ✅ Validate file uploads (size, type, content)
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on critical actions
- ✅ Add CSP headers
- ✅ Never expose sensitive data in client-side code
- ✅ Implement proper CORS configuration
- ✅ Use environment variables for secrets

---

## 📦 Deployment Checklist

- ✅ Set all environment variables in production
- ✅ Enable production build optimizations
- ✅ Configure CDN for static assets
- ✅ Set up error tracking (Sentry, LogRocket)
- ✅ Implement analytics (Google Analytics, Plausible)
- ✅ Run Lighthouse audit (score > 90)
- ✅ Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- ✅ Test on mobile devices (iOS, Android)
- ✅ Set up CI/CD pipeline
- ✅ Configure monitoring & alerting

---

## 💡 Best Practices Summary

1. **ALWAYS** reference FRONTEND-TECHNICAL-SPEC.md for technical decisions
2. **ALWAYS** reference stitch_sign_up_page HTML for UI/UX patterns
3. **ALWAYS** use shadcn/ui components (never custom UI libraries)
4. **ALWAYS** use React Query for server state
5. **ALWAYS** use Zustand for auth state
6. **ALWAYS** validate forms with Zod
7. **ALWAYS** handle errors gracefully with toast notifications
8. **ALWAYS** implement loading states
9. **ALWAYS** write TypeScript in strict mode
10. **ALWAYS** follow the project structure from spec
11. **NEVER** modify API contracts without updating spec
12. **NEVER** use `any` types in TypeScript
13. **NEVER** commit hardcoded credentials
14. **NEVER** skip error handling
15. **NEVER** ignore accessibility

---

## 🆘 When You're Stuck

1. **Check FRONTEND-TECHNICAL-SPEC.md** - 90% of answers are there
2. **Check stitch_sign_up_page HTML** - For UI/UX reference
3. **Check shadcn/ui docs** - For component usage
4. **Check React Query docs** - For data fetching patterns
5. **Ask specific questions** - Don't make assumptions

---

## 📞 Communication Protocol

When implementing:
1. State what you're building (e.g., "Implementing LoginPage component")
2. Reference the HTML template for inspiration (e.g., "Inspired by login_page/code.html")
3. List extracted reusable components (e.g., "Created: FormField, PrimaryButton, InputField")
4. Reference the API endpoint (e.g., "Using POST /api/v1/auths/login")
5. Show the key code snippets
6. Confirm completion with test results

**Example**:
```
✅ Implemented LoginPage component
- HTML Inspiration: login_page/code.html (analyzed structure, not copied)
- Extracted Components:
  ✓ FormField (Molecule) - Reusable form field wrapper
  ✓ SocialAuthButton (Molecule) - Google/Apple OAuth buttons
  ✓ AuthLayout (Template) - Centered auth form layout
- Page Component: LoginPage using composition
- API: POST /api/v1/auths/login
- Features: Email/password login, Google OAuth, remember me
- Validation: Zod loginSchema
- State: Zustand auth store
- Error Handling: Toast notifications
- Reusability: FormField used in Register, Settings, CreateItem pages
```

**Component Checklist Before Committing**:
- [ ] Component có thể reuse ở ít nhất 2 nơi?
- [ ] Props interface rõ ràng và flexible?
- [ ] TypeScript types đầy đủ, không có `any`?
- [ ] Component size < 150 lines? (nếu lớn hơn, cần split)
- [ ] Có error handling và loading states?
- [ ] Responsive design (mobile, tablet, desktop)?
- [ ] Accessibility (aria labels, keyboard navigation)?
- [ ] Code đã được format và không có warnings?

---

**TÓM TẮT**: Đọc kỹ FRONTEND-TECHNICAL-SPEC.md, tham khảo stitch_sign_up_page HTML cho design, dùng đúng tech stack (shadcn/ui + React Query + Zustand), follow project structure, và implement từng trang theo mapping table. Happy coding! 🚀
