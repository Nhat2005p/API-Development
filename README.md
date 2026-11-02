# RESTful API Development Handbook & Hands-on Practice: Cẩm Nang Kiến Thức Toàn Tập

> **Tài liệu tổng hợp toàn diện kiến thức API & RESTful API Development**, được biên soạn chuẩn chỉn chu phục vụ quá trình đào tạo và thực hành dự án tại Sun* / NodeJS Course.
>
> **Tiêu chuẩn & Tài liệu tham khảo:**
> - [Architectural Styles and the Design of Network-based Software Architectures (Dr. Roy Fielding)](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
> - [RFC 7231 - Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231)
> - [RFC 7519 - JSON Web Token (JWT) Standard](https://datatracker.ietf.org/doc/html/rfc7519)
> - [OpenAPI Specification 3.0 (OAS)](https://swagger.io/specification/)

---

## 📑 Mục Lục
1. [Khái niệm API & Kiến trúc RESTful (REST API Architecture)](#1-khái-niệm-api--kiến-trúc-restful)
2. [Chu kỳ Request - Response & Giao thức HTTP](#2-chu-kỳ-request---response--giao-thức-http)
3. [Cơ chế Xác thực & Phân quyền API (API Authentication & Authorization)](#3-cơ-chế-xác-thực--phân-quyền-api)
4. [Tài liệu hóa API (API Documentation với OpenAPI & Swagger)](#4-tài-liệu-hóa-api)
5. [Công cụ & Kiểm thử API (API Tools & Testing)](#5-công-cụ--kiểm-thử-api)
6. [Hướng dẫn Cài đặt & Chạy ứng dụng Thực hành](#6-hướng-dẫn-cài-đặt--chạy-ứng-dụng-thực-hành)

---

## 1. Khái niệm API & Kiến trúc RESTful

### 1.1. API là gì?
- **API** viết tắt của **Application Programming Interface** (Giao diện lập trình ứng dụng).
- API đóng vai trò là một hợp đồng giao tiếp (communication contract) giữa các ứng dụng hoặc các thành phần phần mềm khác nhau.
- Thay vì truy cập trực tiếp vào cơ sở dữ liệu hoặc logic nội bộ của hệ thống khác, một ứng dụng sẽ gửi yêu cầu (Request) qua API và nhận về kết quả (Response) theo một định dạng đã được thỏa thuận trước (thường là JSON hoặc XML).

```text
+-------------------+           HTTP Request (JSON)          +-----------------------+
|                   | -------------------------------------> |                       |
|   Client / UI     |                                        |   Backend Server      |
| (Web/Mobile/Postman) | <------------------------------------- | (Node.js/Express API) |
+-------------------+          HTTP Response (JSON)          +-----------------------+
                                                                     |         ^
                                                                     v         |
                                                             +-----------------------+
                                                             |   Database / Services |
                                                             +-----------------------+
```

---

### 1.2. REST & RESTful API là gì?
- **REST** viết tắt của **Representational State Transfer** — một phong cách kiến trúc phần mềm được tiến sĩ Roy Fielding giới thiệu trong luận án tiến sĩ năm 2000.
- **RESTful API** là một API tuân thủ nghiêm ngặt các nguyên lý thiết kế và ràng buộc kiến trúc của REST, hoạt động chủ yếu dựa trên nền tảng giao thức **HTTP**.

---

### 1.3. Sáu Nguyên lý Kiến trúc Cốt lõi của REST (REST Constraints)
Để một API được công nhận là chuẩn RESTful, nó cần tuân thủ 6 nguyên tắc ràng buộc:

| # | Nguyên lý | Ý nghĩa chi tiết |
| :- | :--- | :--- |
| **1** | **Client - Server Separation** | Tách rời hoàn toàn giao diện người dùng (Client) và logic xử lý dữ liệu (Server). Cho phép Client và Server phát triển, mở rộng độc lập. |
| **2** | **Stateless (Phi trạng thái)** | Mọi yêu cầu từ Client gửi lên Server phải chứa đầy đủ mọi thông tin cần thiết để Server hiểu và xử lý. Server không lưu giữ bất kỳ ngữ cảnh (session context) nào của Client giữa các request. |
| **3** | **Cacheable (Khả năng lưu đệm)** | Dữ liệu trả về từ Server phải tự định rõ có được phép lưu bộ nhớ đệm (cache) hay không (qua các header như `Cache-Control`, `ETag`) nhằm giảm tải server và tăng tốc độ phản hồi. |
| **4** | **Layered System (Hệ thống phân tầng)** | Client không thể biết liệu nó đang kết nối trực tiếp với máy chủ ứng dụng hay qua các tầng trung gian (như Proxy, API Gateway, Load Balancer, CDN). |
| **5** | **Uniform Interface (Giao diện đồng nhất)** | Ràng buộc quan trọng nhất: Tài nguyên được định danh thống nhất qua URI; thao tác trên tài nguyên thông qua biểu diễn (JSON/XML); thông điệp tự mô tả (self-descriptive); điều hướng qua liên kết (HATEOAS). |
| **6** | **Code on Demand (Tùy chọn)** | Server có thể mở rộng tính năng của Client bằng cách gửi mã thực thi (ví dụ JavaScript, applets). Đây là nguyên lý tuỳ chọn duy nhất. |

---

### 1.4. Quy tắc Thiết kế RESTful API Chuẩn mực (Best Practices)

1. **Sử dụng Danh từ số nhiều (Plural Nouns) để định danh tài nguyên (Resources):**
   - ✅ Chuẩn REST: `GET /api/v1/products`, `POST /api/v1/users`
   - ❌ Sai quy chuẩn: `GET /api/v1/getProducts`, `POST /api/v1/createUser` (Không mang động từ vào URL).

2. **Dùng phương thức HTTP (HTTP Verbs) để thể hiện hành động:**
   - `GET /products` : Đọc danh sách sản phẩm.
   - `POST /products` : Tạo sản phẩm mới.
   - `PUT /products/:id` : Thay thế toàn bộ sản phẩm.
   - `PATCH /products/:id` : Cập nhật một phần sản phẩm.
   - `DELETE /products/:id` : Xóa sản phẩm.

3. **Mối quan hệ phân cấp Cha - Con (Hierarchical URIs):**
   - Lấy danh sách bình luận của bài viết #10: `GET /api/v1/posts/10/comments`
   - Thêm bình luận vào bài viết #10: `POST /api/v1/posts/10/comments`

4. **Phiên bản hóa API (API Versioning):**
   - Đặt phiên bản trực tiếp trên URI để đảm bảo tính tương thích ngược: `/api/v1/resource`, `/api/v2/resource`.

5. **Tính Idempotent (Bảo toàn trạng thái khi gọi lặp lại):**
   - **Idempotent**: Gọi 1 lần hay 100 lần với cùng tham số thì kết quả trạng thái trên server không thay đổi (`GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`).
   - **Non-Idempotent**: Mỗi lần gọi sẽ làm thay đổi trạng thái server hoặc tạo mới tài nguyên (`POST`, `PATCH`).

---

## 2. Chu kỳ Request - Response & Giao thức HTTP

### 2.1. Chu kỳ Giao tiếp (Request - Response Cycle)
Mỗi tương tác trong REST API đều diễn ra theo chu kỳ 4 bước cơ bản:
1. **Client gửi HTTP Request**: Chứa URL, Method, Headers, và có thể có Body hoặc Query Params.
2. **Network Routing & Middleware**: Request đi qua DNS, Gateway, Firewall, vào server và qua các middleware (CORS, Auth, Logger).
3. **Controller & Service Execution**: Controller nhận request, xử lý logic, đọc/ghi cơ sở dữ liệu.
4. **Server gửi HTTP Response**: Trả về dữ liệu kết quả, kèm HTTP Status Code và Headers mô tả.

---

### 2.2. Phân loại HTTP Methods

| Method | Mục đích | Body? | Idempotent? | Safe? |
| :--- | :--- | :---: | :---: | :---: |
| **`GET`** | Lấy dữ liệu tài nguyên | Không | Có | Có |
| **`POST`** | Tạo mới tài nguyên hoặc submit form | Có | Không | Không |
| **`PUT`** | Thay thế toàn bộ tài nguyên (nếu chưa có thì tạo mới) | Có | Có | Không |
| **`PATCH`** | Cập nhật một phần tài nguyên (chỉ các trường chỉ định) | Có | Thường không | Không |
| **`DELETE`** | Xóa một tài nguyên chỉ định | Hiếm khi | Có | Không |
| **`OPTIONS`** | Thăm dò các method và header được phép (CORS Preflight) | Không | Có | Có |
| **`HEAD`** | Tương tự GET nhưng chỉ trả về Headers, không kèm Body | Không | Có | Có |

#### 💡 Phân biệt chuyên sâu: `PUT` vs `PATCH`
- **`PUT`**: Yêu cầu Client gửi lên **toàn bộ đối tượng**. Trường nào không gửi sẽ bị ghi đè thành giá trị mặc định hoặc `null`.
- **`PATCH`**: Client chỉ cần gửi **các trường cần thay đổi**. Các trường còn lại của đối tượng được giữ nguyên vẹn.

---

### 2.3. Cấu trúc HTTP Request: Headers, Parameters & Body

#### A. HTTP Request Headers quan trọng
- `Content-Type`: Kiểu dữ liệu của Body gửi lên (ví dụ: `application/json`, `multipart/form-data`, `application/x-www-form-urlencoded`).
- `Accept`: Kiểu dữ liệu mà Client mong muốn nhận về từ Server (`application/json`).
- `Authorization`: Thông tin xác thực định danh (ví dụ: `Bearer <jwt_token>`).
- `Origin`: Tên miền gốc gửi request (dùng trong kiểm tra CORS).
- `User-Agent`: Thông tin trình duyệt/ứng dụng gửi request.

#### B. Phân loại Parameters trong Request
1. **Path / Route Parameters:** Định danh tài nguyên cụ thể nằm trực tiếp trong đường dẫn:
   - Ví dụ: `/api/v1/products/:id` $\rightarrow$ `/api/v1/products/101`
2. **Query Parameters:** Bộ lọc, tìm kiếm, sắp xếp, phân trang nằm sau dấu `?`:
   - Ví dụ: `/api/v1/products?category=laptops&minPrice=1000&page=1&limit=10`
3. **Request Body:** Khối dữ liệu chính (payload) gửi kèm trong request `POST`, `PUT`, `PATCH`:
   ```json
   {
     "title": "MacBook Pro 16 inch",
     "price": 3499,
     "stock": 20
   }
   ```

---

### 2.4. HTTP Status Codes Toàn Diện

Trạng thái phản hồi HTTP được phân chia thành 5 nhóm lớn:

#### 🟢 2xx: Thành công (Success)
- **`200 OK`**: Yêu cầu thành công (thường dùng cho `GET`, `PUT`, `PATCH`).
- **`201 Created`**: Tạo tài nguyên mới thành công (dùng cho `POST`). Kèm theo header `Location` trỏ đến URI của tài nguyên mới.
- **`204 No Content`**: Yêu cầu thành công nhưng không có nội dung trả về trong Body (dùng cho `DELETE`).

#### 🔵 3xx: Chuyển hướng (Redirection)
- **`301 Moved Permanently`**: Tài nguyên đã được chuyển vĩnh viễn sang URI mới.
- **`304 Not Modified`**: Dữ liệu không thay đổi so với bản cache của client (tiết kiệm băng thông).

#### 🟡 4xx: Lỗi phía Client (Client Errors)
- **`400 Bad Request`**: Dữ liệu gửi lên sai cú pháp hoặc thiếu trường bắt buộc.
- **`401 Unauthorized`**: Chưa xác thực (thiếu token, token sai hoặc hết hạn).
- **`403 Forbidden`**: Đã xác thực thành công nhưng không đủ quyền thực hiện hành động này.
- **`404 Not Found`**: Không tìm thấy URI hoặc tài nguyên yêu cầu.
- **`409 Conflict`**: Xung đột trạng thái dữ liệu (ví dụ: Đăng ký tài khoản với email đã tồn tại).
- **`422 Unprocessable Entity`**: Cú pháp đúng chuẩn nhưng dữ liệu không thỏa mãn validation logic nghiệp vụ.
- **`429 Too Many Requests`**: Client gửi quá nhiều request vượt quá giới hạn Rate Limit cho phép.

#### 🔴 5xx: Lỗi phía Server (Server Errors)
- **`500 Internal Server Error`**: Lỗi hệ thống máy chủ không lường trước (exception chưa bắt).
- **`502 Bad Gateway`**: Máy chủ proxy nhận phản hồi không hợp lệ từ máy chủ cấp cao hơn.
- **`503 Service Unavailable`**: Máy chủ đang bị quá tải hoặc đang bảo trì tạm thời.
- **`504 Gateway Timeout`**: Máy chủ gateway hết thời gian chờ phản hồi từ upstream server.

---

### 2.5. Định dạng Chuẩn của REST JSON Response Envelope
Một REST API chuyên nghiệp luôn phản hồi theo một cấu trúc nhất quán để Client dễ dàng bóc tách:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách sản phẩm thành công.",
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "limit": 10
  },
  "data": [
    { "id": 1, "title": "MacBook Pro", "price": 3499 }
  ]
}
```

---

## 3. Cơ chế Xác thực & Phân quyền API

### 3.1. Phân biệt Authentication vs Authorization
- **Authentication (AuthN - Xác thực):** Trả lời câu hỏi **"Bạn là ai?"**. Là quá trình kiểm tra danh tính (ví dụ: email + password, OTP, biometric).
- **Authorization (AuthZ - Phân quyền):** Trả lời câu hỏi **"Bạn có quyền làm gì?"**. Là quá trình kiểm tra quyền hạn sau khi đã xác thực (ví dụ: Trainee chỉ được xem, Admin được phép xoá).

---

### 3.2. Các Cơ chế Xác thực API Phổ biến

```text
+-------------------+-------------------------------------------------------------+-------------------------------+
| Cơ chế            | Nguyên lý hoạt động                                         | Ứng dụng phổ biến             |
+-------------------+-------------------------------------------------------------+-------------------------------+
| API Key           | Gửi một chuỗi bí mật cố định qua Header (x-api-key)        | Tích hợp Server-to-Server     |
| Basic Auth        | Mã hóa Base64 chuỗi "username:password" qua Authorization   | Test nội bộ, API đơn giản     |
| Bearer JWT Token  | Client gửi token ký số dạng "Bearer <token>"                | Single Page App, Mobile App   |
| OAuth 2.0         | Cấp quyền uỷ nhiệm qua token của bên thứ ba (Google/GitHub) | SSO, Đăng nhập mạng xã hội    |
+-------------------+-------------------------------------------------------------+-------------------------------+
```

---

### 3.3. Chuyên sâu về JSON Web Token (JWT)

#### A. Cấu trúc 3 phần của JWT
Một chuỗi JWT gồm 3 phần được phân tách bằng dấu chấm (`.`): `Header.Payload.Signature`

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl8xIiwibmFtZSI6Ik1pbmggTmhhdCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDU5OTYwMCwiZXhwIjoxNzMwNjg2MDAwfQ.gP0wE_5f8b9J8H3Z8J_1k2l3m4n5o6p7q8r9s0t1u2v
\___________________________________/ \_________________________________________________________________________________/ \_____________________________________________________________/
               Header                                                       Payload                                                                     Signature
```

1. **Header:** Chứa thuật toán mã hóa (ví dụ: `HS256` hoặc `RS256`) và kiểu token (`JWT`).
2. **Payload:** Chứa thông tin dữ liệu (Claims) như `id`, `email`, `role`, thời điểm tạo (`iat`), thời hạn hết hạn (`exp`). **Lưu ý: Không bao giờ lưu mật khẩu hoặc thông tin nhạy cảm trong payload vì nó chỉ được mã hóa Base64Url chứ không hề mã hóa bí mật.**
3. **Signature (Chữ ký số):** Được tạo ra bằng cách lấy:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}), \text{secretKey})$$
   $\rightarrow$ Đảm bảo tính toàn vẹn (Integrity): Nếu bất kỳ ai sửa đổi payload, chữ ký sẽ không khớp và server từ chối ngay lập tức.

#### B. Vòng đời Xác thực với Access Token & Refresh Token
```text
Client                              Server
  |                                   |
  |--- 1. POST /auth/login ---------->| (Xác thực email & password)
  |                                   |
  |<-- 2. Trả về Access & Refresh ----| (Access Token sống ngắn: 15m, Refresh Token: 7d)
  |                                   |
  |--- 3. GET /products (Bearer AT) ->| (Xác thực token hợp lệ)
  |<-- 4. Trả về dữ liệu -------------|
  |                                   |
  |        [Access Token hết hạn]     |
  |--- 5. GET /products (Bearer AT) ->|
  |<-- 6. Phản hồi 401 Unauthorized --|
  |                                   |
  |--- 7. POST /auth/refresh -------->| (Gửi Refresh Token để xin cấp lại)
  |<-- 8. Cấp Access Token mới -------|
```

---

### 3.4. Giới thiệu OAuth 2.0
OAuth 2.0 là giao thức ủy quyền (Authorization Framework) cho phép ứng dụng bên thứ ba truy cập có giới hạn vào tài nguyên người dùng mà không cần biết mật khẩu của họ.
- **4 Vai trò trong OAuth 2.0:**
  1. *Resource Owner:* Người dùng sở hữu tài khoản.
  2. *Client:* Ứng dụng muốn truy cập dữ liệu của người dùng.
  3. *Authorization Server:* Máy chủ xác thực (Google, GitHub, Facebook) cấp token.
  4. *Resource Server:* Máy chủ chứa dữ liệu tài nguyên thực tế.

---

### 3.5. Các Biện pháp Bảo mật API Thực tế
1. **Bắt buộc sử dụng HTTPS / TLS:** Mã hóa toàn bộ đường truyền dữ liệu, chống tấn công Man-in-the-Middle (MitM).
2. **Rate Limiting:** Giới hạn số lượng request từ một địa chỉ IP trong một khoảng thời gian (chống Brute-force & DDoS).
3. **CORS (Cross-Origin Resource Sharing):** Chỉ cho phép các domain được chỉ định quyền truy cập API.
4. **Mã hóa mật khẩu bằng thuật toán một chiều (Bcrypt):** Băm mật khẩu kèm Salt, không bao giờ lưu mật khẩu dạng plain-text.
5. **Input Sanitization & Validation:** Lọc và kiểm tra kiểu dữ liệu đầu vào chặt chẽ nhằm triệt tiêu lỗ hổng Injection.

---

## 4. Tài liệu hóa API

### 4.1. Tại sao Tài liệu API lại Sống còn?
- Là bản hợp đồng kỹ thuật giữa đội ngũ Backend và Frontend / Mobile / Third-party Developers.
- Giúp giảm thiểu tối đa sự trao đổi thủ công, sai lệch kiểu dữ liệu hoặc nhầm lẫn endpoint.
- Rút ngắn thời gian tích hợp và onboarding thành viên mới vào dự án.

---

### 4.2. Chuẩn OpenAPI (OAS 3.0) & Swagger UI
- **OpenAPI Specification:** Định dạng chuẩn hóa mô tả REST API độc lập với ngôn ngữ lập trình (sử dụng JSON hoặc YAML).
- **Swagger UI:** Công cụ biến file mô tả OpenAPI thành một giao diện web trực quan, cho phép lập trình viên đọc tài liệu và bấm nút **"Try it out"** để gửi request trực tiếp ngay trên trình duyệt.

Trong dự án thực hành này, Swagger UI được tích hợp sẵn tại endpoint:
👉 `http://localhost:3000/api-docs`

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "API Development - RESTful Practice API",
    "version": "1.0.0"
  },
  "paths": {
    "/api/v1/products": {
      "get": {
        "summary": "Lấy danh sách sản phẩm",
        "responses": {
          "200": { "description": "Success" }
        }
      }
    }
  }
}
```

---

### 4.3. Postman Documentation & Export Collection
Postman cho phép xuất (Export) toàn bộ các Request đã tổ chức thành một file JSON định dạng chuẩn Postman Collection v2.1.
- Trong repository này, file collection hoàn chỉnh đã được đặt tại:
  [`postman/API-Development.postman_collection.json`](file:///d:/node_js/thuctaptn/nodejs/API-Development/postman/API-Development.postman_collection.json)
- Chỉ cần mở Postman $\rightarrow$ Chọn **Import** $\rightarrow$ Kéo file JSON vào là sẵn sàng kiểm thử toàn bộ hệ thống API!

---

## 5. Công cụ & Kiểm thử API

### 5.1. Kiểm thử với Postman

Postman là công cụ kiểm thử API mạnh mẽ nhất hiện nay:
- **Collections & Folders:** Nhóm các request theo từng module nghiệp vụ (Auth, Products, Users).
- **Environment Variables:** Biến môi trường linh hoạt (`{{baseUrl}}`, `{{token}}`).
- **Tests Scripts:** Viết mã JavaScript tự động kiểm tra phản hồi ngay sau khi gửi request:
  ```javascript
  // Kiểm tra mã trạng thái trả về là 200
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });

  // Tự động lưu Token vào biến sau khi đăng nhập thành công
  const jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.token) {
    pm.collectionVariables.set("token", jsonData.data.token);
  }
  ```

---

### 5.2. Kiểm thử Nhanh bằng cURL qua Terminal

cURL là tiện ích dòng lệnh có sẵn trên mọi hệ điều hành (Windows, Linux, macOS) giúp gửi request trực tiếp:

#### 1. Kiểm tra trạng thái hệ thống (Health Check)
```bash
curl -X GET http://localhost:3000/health
```

#### 2. Lấy danh sách sản phẩm có lọc và phân trang
```bash
curl -X GET "http://localhost:3000/api/v1/products?category=laptops&limit=2"
```

#### 3. Đăng nhập để lấy Bearer JWT Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sun-asterisk.com","password":"Admin@123"}'
```

#### 4. Xem thông tin cá nhân với Bearer Token
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <DAN_TOKEN_CUA_BAN_VAO_DAY>"
```

#### 5. Thêm mới một sản phẩm (Yêu cầu Token)
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DAN_TOKEN_CUA_BAN_VAO_DAY>" \
  -d '{"title":"Bàn phím cơ Custom","category":"accessories","price":150,"stock":20}'
```

#### 6. Cập nhật một phần thông tin sản phẩm (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DAN_TOKEN_CUA_BAN_VAO_DAY>" \
  -d '{"price":2999}'
```

#### 7. Xóa sản phẩm (DELETE - Yêu cầu Token quyền Admin)
```bash
curl -X DELETE http://localhost:3000/api/v1/products/5 \
  -H "Authorization: Bearer <DAN_TOKEN_CUA_BAN_VAO_DAY>"
```

---

### 5.3. Các Công cụ Hỗ trợ Khác
- **Thunder Client / REST Client:** Extension tích hợp trực tiếp trong VS Code, nhẹ và tiện lợi.
- **Insomnia:** Công cụ kiểm thử giao diện hiện đại, hỗ trợ mạnh mẽ GraphQL và REST.
- **Bruno:** Công cụ API Client mã nguồn mở lưu trữ bộ sưu tập trực tiếp dạng text files trong Git repo.

---

## 6. Hướng dẫn Cài đặt & Chạy ứng dụng Thực hành

### 6.1. Cấu trúc Thư mục Dự án
```text
API-Development/
├── postman/
│   └── API-Development.postman_collection.json  # File Collection Postman v2.1 đầy đủ
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js                   # Logic đăng ký, đăng nhập JWT, lấy profile
│   │   └── product.controller.js                # Logic CRUD sản phẩm, phân trang, lọc
│   ├── docs/
│   │   └── swagger.json                         # Đặc tả OpenAPI 3.0 chi tiết
│   ├── middleware/
│   │   ├── auth.middleware.js                   # Middleware xác thực JWT & Role-based Auth
│   │   └── error.middleware.js                  # Middleware bắt 404 & Global Error Handler
│   ├── routes/
│   │   ├── auth.routes.js                       # Định tuyến endpoint xác thực
│   │   └── product.routes.js                    # Định tuyến endpoint sản phẩm
│   └── app.js                                   # Cấu hình Express, CORS, Swagger UI
├── tests/
│   └── api.test.js                              # Bộ kiểm thử tự động 10 kịch bản test
├── .env.example                                 # File mẫu biến môi trường
├── .gitignore                                   # Cấu hình loại bỏ file không commit
├── package.json                                 # Danh sách dependencies và npm scripts
├── README.md                                    # Tài liệu cẩm nang toàn tập
└── server.js                                    # File khởi động Server
```

---

### 6.2. Các Bước Cài đặt & Chạy Server

#### Bước 1: Di chuyển vào thư mục dự án
```bash
cd API-Development
```

#### Bước 2: Cài đặt các thư viện cần thiết
```bash
npm install
```

#### Bước 3: Tạo file cấu hình môi trường
```bash
cp .env.example .env
```

#### Bước 4: Khởi động Server
```bash
# Khởi động chế độ development (tự động reload khi sửa code)
npm run dev

# Hoặc khởi động server thông thường
npm start
```
Sau khi server chạy, truy cập ngay các đường dẫn:
- 📄 **Swagger UI Documentation:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- 🔗 **API Endpoint Gốc:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- 🩺 **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)

---

### 6.3. Chạy Bộ Kiểm thử Tự động (Automated Testing)
Dự án được tích hợp sẵn 10 test case tự động bao quát toàn bộ các trường hợp: Kiểm tra server health, phân trang, chặn request chưa đăng nhập, xác thực đăng nhập cấp JWT, tạo mới tài nguyên kèm Location header, cập nhật PATCH, xóa DELETE quyền admin, và bắt lỗi 404:

```bash
npm test
```
*Kết quả mẫu khi chạy:*
```text
🧪 Bắt đầu chạy bộ kiểm thử tự động (API Automated Tests)...

  ✅ PASS: GET /health trả về status 200 và UP
  ✅ PASS: GET /api/v1/products trả về 200 và phân trang hợp lệ
  ✅ PASS: POST /api/v1/products thiếu token bị từ chối với status 401
  ✅ PASS: POST /api/v1/auth/login thành công cấp phát JWT Bearer Token
  ✅ PASS: GET /api/v1/auth/me với Bearer Token trả về đúng thông tin tài khoản
  ✅ PASS: POST /api/v1/products thành công trả về 201 Created kèm Location header
  ✅ PASS: GET /api/v1/products/6 trả về đúng 200 OK
  ✅ PASS: PATCH /api/v1/products/6 cập nhật giá thành công lên 180
  ✅ PASS: DELETE /api/v1/products/6 trả về đúng 204 No Content
  ✅ PASS: Truy cập route không tồn tại trả về đúng 404 Not Found

📊 Kết quả kiểm thử: 10 passed, 0 failed
```

---

### 6.4. Tài khoản Kiểm thử Khởi tạo Sẵn (Seed Data)
| Tài khoản | Email | Mật khẩu | Quyền hạn (Role) |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@sun-asterisk.com` | `Admin@123` | `admin` (Toàn quyền CRUD, được xóa) |
| **Thực tập sinh (Trainee)** | `trainee@sun-asterisk.com` | `Trainee@123` | `trainee` (Xem, Thêm, Sửa) |

---
*Tài liệu và mã nguồn được xây dựng và duy trì bởi [Nhat2005p](https://github.com/Nhat2005p) - Thực tập sinh NodeJS tại Sun Asterisk.*
