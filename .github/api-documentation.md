# API Documentation - Auction System

## Thông tin chung

- **Base URL**: `http://localhost:<PORT>/api/v1`
- **API Version**: v1
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`

---

## 📋 Mục lục

1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Item APIs](#item-apis)
4. [Bid APIs](#bid-apis)

---

## 🔐 Authentication APIs

### 1. Register (Đăng ký tài khoản)

**Endpoint**: `POST /api/v1/auths/register`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gender": "male",
  "birthday": "1990-01-01",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "gender": "male",
    "birthday": "1990-01-01",
    "phoneNumber": "+1234567890"
  }
}
```

---

### 2. Login (Đăng nhập)

**Endpoint**: `POST /api/v1/auths/login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

---

### 3. Google Login (Đăng nhập bằng Google)

**Endpoint**: `POST /api/v1/auths/google`

**Request Body**:
```json
{
  "idToken": "google_id_token_here"
}
```

**Response** (200 OK): Tương tự như Login

---

### 4. Apple Login (Đăng nhập bằng Apple)

**Endpoint**: `POST /api/v1/auths/apple`

**Request Body**:
```json
{
  "identityToken": "apple_identity_token_here",
  "authorizationCode": "apple_authorization_code_here"
}
```

**Response** (200 OK): Tương tự như Login

---

### 5. Refresh Token (Làm mới access token)

**Endpoint**: `POST /api/v1/auths/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "token": {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresIn": 3600
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

---

### 6. Get Current User (Lấy thông tin người dùng hiện tại)

**Endpoint**: `GET /api/v1/auths/me`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gender": "male",
  "birthday": "1990-01-01",
  "phoneNumber": "+1234567890"
}
```

---

## 👤 User APIs

### 1. Create User (Tạo người dùng)

**Endpoint**: `POST /api/v1/users`

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "gender": "female",
  "birthday": "1995-05-15",
  "phoneNumber": "+9876543210"
}
```

**Response** (201 Created):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com"
}
```

---

## 📦 Item APIs

### 1. Create Item (Tạo sản phẩm đấu giá)

**Endpoint**: `POST /api/v1/items`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "name": "Vintage Clock",
  "description": "A beautiful vintage clock from the 19th century",
  "startingPrice": 100,
  "startTime": "2026-10-01T10:00:00Z",
  "endTime": "2026-10-07T10:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Vintage Clock",
  "description": "A beautiful vintage clock from the 19th century",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "startingPrice": 100,
  "startTime": "2026-10-01T10:00:00Z",
  "endTime": "2026-10-07T10:00:00Z",
  "createdAt": "2025-12-14T10:00:00Z"
}
```

---

### 2. Get Item By ID (Lấy thông tin sản phẩm theo ID)

**Endpoint**: `GET /api/v1/items/:id`

**Parameters**:
- `id` (UUID): ID của sản phẩm

**Response** (200 OK):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Vintage Clock",
  "description": "A beautiful vintage clock from the 19th century",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "startingPrice": 100,
  "startTime": "2026-10-01T10:00:00Z",
  "endTime": "2026-10-07T10:00:00Z",
  "createdAt": "2025-12-14T10:00:00Z",
  "updatedAt": "2025-12-14T10:00:00Z",
  "currentBid": 150,
  "totalBids": 5
}
```

---

### 3. Get Non-Bidded Items (Lấy danh sách sản phẩm chưa có bid)

**Endpoint**: `GET /api/v1/items/non-bidded`

**Query Parameters** (optional):
- `name` (string): Tìm kiếm theo tên
- `startingPriceFrom` (number): Giá khởi điểm từ
- `startingPriceTo` (number): Giá khởi điểm đến

**Example**: `/api/v1/items/non-bidded?name=clock&startingPriceFrom=50&startingPriceTo=200`

**Response** (200 OK):
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Vintage Clock",
    "description": "A beautiful vintage clock from the 19th century",
    "startingPrice": 100,
    "startTime": "2026-10-01T10:00:00Z",
    "endTime": "2026-10-07T10:00:00Z"
  }
]
```

---

### 4. Get Items By Owner ID (Lấy danh sách sản phẩm theo chủ sở hữu)

**Endpoint**: `GET /api/v1/items/:ownerId/owner`

**Parameters**:
- `ownerId` (UUID): ID của chủ sở hữu

**Response** (200 OK):
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Vintage Clock",
    "description": "A beautiful vintage clock from the 19th century",
    "startingPrice": 100,
    "startTime": "2026-10-01T10:00:00Z",
    "endTime": "2026-10-07T10:00:00Z"
  }
]
```

---

### 5. Update Item (Cập nhật sản phẩm)

**Endpoint**: `PUT /api/v1/items/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Parameters**:
- `id` (UUID): ID của sản phẩm

**Request Body**:
```json
{
  "name": "Updated Vintage Clock",
  "description": "Updated description",
  "startingPrice": 120,
  "startTime": "2026-10-01T10:00:00Z",
  "endTime": "2026-10-07T10:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Updated Vintage Clock",
  "description": "Updated description",
  "startingPrice": 120
}
```

---

### 6. Lock Item (Khóa sản phẩm)

**Endpoint**: `PUT /api/v1/items/:id/lock`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Parameters**:
- `id` (UUID): ID của sản phẩm

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Item locked successfully"
}
```

---

### 7. Get Winning Bids By User ID (Lấy danh sách các bid thắng cuộc theo user)

**Endpoint**: `GET /api/v1/items/:userId/winning-bids`

**Parameters**:
- `userId` (UUID): ID của người dùng

**Response** (200 OK):
```json
[
  {
    "itemId": "770e8400-e29b-41d4-a716-446655440002",
    "itemName": "Vintage Clock",
    "winningBid": 200,
    "bidTime": "2026-10-06T15:30:00Z"
  }
]
```

---

### 8. Get Revenue By Owner ID (Lấy doanh thu theo chủ sở hữu)

**Endpoint**: `GET /api/v1/items/:userId/revenue`

**Parameters**:
- `userId` (UUID): ID của chủ sở hữu

**Query Parameters** (required):
- `startDate` (string): Ngày bắt đầu (ISO format: 2023-01-01)
- `endDate` (string): Ngày kết thúc (ISO format: 2023-12-31)

**Example**: `/api/v1/items/550e8400-e29b-41d4-a716-446655440000/revenue?startDate=2023-01-01&endDate=2023-12-31`

**Response** (200 OK):
```json
{
  "totalRevenue": 5000,
  "itemsSold": 10,
  "startDate": "2023-01-01",
  "endDate": "2023-12-31"
}
```

---

### 9. Export Item to PDF (Xuất thông tin sản phẩm ra PDF)

**Endpoint**: `GET /api/v1/items/pdf/:id`

**Parameters**:
- `id` (UUID): ID của sản phẩm

**Response** (200 OK):
- Content-Type: `application/pdf`
- File download: `item-{id}.pdf`

---

### 10. Export Winning Bids to PDF (Xuất danh sách bid thắng cuộc ra PDF)

**Endpoint**: `GET /api/v1/items/:userId/winning-bids/pdf`

**Parameters**:
- `userId` (UUID): ID của người dùng

**Response** (200 OK):
- Content-Type: `application/pdf`
- File download: `winning-bids-{userId}.pdf`

---

## 💰 Bid APIs

### 1. Place Bid (Đặt giá thầu)

**Endpoint**: `POST /api/v1/bids`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "itemId": "770e8400-e29b-41d4-a716-446655440002",
  "price": 150.0
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Bid placed successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `403 Forbidden`: Không được phép đấu giá (vi phạm quy tắc business)
- `404 Not Found`: Không tìm thấy user hoặc item

---

## 🔒 Authentication & Authorization

### Bearer Token

Hầu hết các endpoints đều yêu cầu authentication. Thêm token vào header:

```
Authorization: Bearer <your_access_token>
```

### Token Expiration

- Access Token: Hết hạn sau 3600 giây (1 giờ)
- Refresh Token: Sử dụng để lấy access token mới khi hết hạn

---

## 📝 Common Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🎯 Business Rules

### Bidding Rules:
1. Giá bid phải cao hơn giá hiện tại
2. Không thể bid vào item của chính mình
3. Chỉ có thể bid trong thời gian đấu giá (startTime - endTime)
4. Item phải ở trạng thái mở (không bị khóa)

### Item Rules:
1. Chỉ owner mới có thể update hoặc lock item
2. Không thể update item đã có bid
3. startTime phải nhỏ hơn endTime
4. startingPrice phải lớn hơn 0

---

## 📊 Data Models

### Gender Enum
```typescript
enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}
```

### UUID Format
Tất cả ID đều sử dụng UUID v4:
```
550e8400-e29b-41d4-a716-446655440000
```

### Date Format
ISO 8601 format:
```
2026-10-01T10:00:00Z
```

---

## 🚀 Quick Start Examples

### Example 1: Register và Login
```bash
# 1. Register
curl -X POST http://localhost:3000/api/v1/auths/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "gender": "male",
    "birthday": "1990-01-01",
    "phoneNumber": "+1234567890",
    "password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/v1/auths/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example 2: Create Item và Place Bid
```bash
# 1. Create Item (cần token)
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Vintage Clock",
    "description": "Beautiful clock",
    "startingPrice": 100,
    "startTime": "2026-10-01T10:00:00Z",
    "endTime": "2026-10-07T10:00:00Z"
  }'

# 2. Place Bid (cần token)
curl -X POST http://localhost:3000/api/v1/bids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "itemId": "ITEM_UUID",
    "price": 150
  }'
```

---

## 📞 Support

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với team phát triển.

---

**Last Updated**: December 14, 2025
