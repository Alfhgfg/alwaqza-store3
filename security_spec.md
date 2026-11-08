# Security Specification: Al-Waqza Store (متجر الوقزة)

## 1. Data Invariants
1. **Catalog Integrity**: Public users can read `products`, `categories`, `banners`, and `store_settings`. Only verified administrators can create, update, or delete catalog records.
2. **Order Confidentiality**: Regular customers can read only their own orders (`resource.data.userId == request.auth.uid`). Anonymous or guest orders are restricted to the session/owner. Admins can view and update all orders.
3. **External Sourcing Request Privacy**: Product requests (`product_requests`) can only be read and created by the requesting user (`resource.data.userId == request.auth.uid`) or viewed and price-quoted by admins.
4. **Price Immutability on Orders**: When updating an order, customers cannot alter price fields, subtotal, delivery fee, or total. Status updates can only be performed by admins, except for customer cancellation on orders that are still in 'جديد' (New) or 'قيد التأكيد' status.
5. **No Self-Assigned Privileges**: In `users` collection, users can update their profile information (name, phone, address), but cannot escalate their own `role` to 'admin'.
6. **Path Hardening**: All document keys must be safe strings conforming to `^[a-zA-Z0-9_\-]+$`.

## 2. The Dirty Dozen Payloads
1. **Attacker attempts to forge Admin Role**: `{ "id": "user123", "email": "attacker@test.com", "role": "admin" }` -> REJECTED.
2. **Customer alters Order status directly to 'تم التسليم' (Delivered)**: `{ "status": "تم التسليم" }` -> REJECTED.
3. **Customer modifies Order total after placement**: `{ "total": 0 }` -> REJECTED.
4. **Unauthenticated user writes new Product**: `{ "name": "Fake iPhone", "price": 10 }` -> REJECTED.
5. **Customer queries orders of another customer**: `GET /orders/foreignOrder` where `userId != request.auth.uid` -> REJECTED.
6. **Customer updates Admin quote on external ProductRequest**: `{ "quotedPrice": 5, "status": "تمت الموافقة" }` -> REJECTED.
7. **Malicious document ID injection**: `POST /products/%2E%2E%2Fadmins` -> REJECTED.
8. **Shadow field injection**: `{ "name": "Shirt", "price": 50, "__isSuperAdmin": true }` -> REJECTED.
9. **Unauthenticated modification of store settings**: `PUT /store_settings/default` -> REJECTED.
10. **Customer attempts to read another user's external requests**: `GET /product_requests/requestOfOther` -> REJECTED.
11. **Oversized description buffer overflow attempt**: `{ "description": "a".repeat(100000) }` -> REJECTED.
12. **Negative price product update**: `{ "price": -500 }` -> REJECTED.

## 3. Test Runner Design
Unit and integration tests verify that all 12 payloads return `PERMISSION_DENIED` and ensure role-based separation between customers and admin (`abdulrahmanalshaiby2060@gmail.com`).
