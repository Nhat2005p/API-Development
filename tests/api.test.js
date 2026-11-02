const app = require("../src/app");
const http = require("http");

async function runTests() {
  console.log("🧪 Bắt đầu chạy bộ kiểm thử tự động (API Automated Tests)...\n");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // Test 1: Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === "UP", "GET /health trả về status 200 và UP");

    // Test 2: Public products list
    const prodRes = await fetch(`${baseUrl}/api/v1/products?limit=2`);
    const prodData = await prodRes.json();
    assert(
      prodRes.status === 200 && Array.isArray(prodData.data) && prodData.pagination.limit === 2,
      "GET /api/v1/products trả về 200 và phân trang hợp lệ"
    );

    // Test 3: Protected endpoint without token -> 401
    const unauthRes = await fetch(`${baseUrl}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test Item", category: "test", price: 100 })
    });
    assert(unauthRes.status === 401, "POST /api/v1/products thiếu token bị từ chối với status 401");

    // Test 4: Auth Login
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@sun-asterisk.com", password: "Admin@123" })
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 && !!loginData.data.token,
      "POST /api/v1/auth/login thành công cấp phát JWT Bearer Token"
    );
    const adminToken = loginData.data?.token;

    // Test 5: Auth Me with Token
    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const meData = await meRes.json();
    assert(
      meRes.status === 200 && meData.data.email === "admin@sun-asterisk.com",
      "GET /api/v1/auth/me với Bearer Token trả về đúng thông tin tài khoản"
    );

    // Test 6: Create Product with Token
    const createRes = await fetch(`${baseUrl}/api/v1/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: "Test Mechanical Keyboard",
        category: "accessories",
        price: 150,
        stock: 10
      })
    });
    const createData = await createRes.json();
    assert(
      createRes.status === 201 && createData.data.id && createRes.headers.get("location"),
      "POST /api/v1/products thành công trả về 201 Created kèm Location header"
    );
    const createdId = createData.data?.id;

    // Test 7: Get Product by ID
    const getByIdRes = await fetch(`${baseUrl}/api/v1/products/${createdId}`);
    assert(getByIdRes.status === 200, `GET /api/v1/products/${createdId} trả về đúng 200 OK`);

    // Test 8: Partial Update (PATCH)
    const patchRes = await fetch(`${baseUrl}/api/v1/products/${createdId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ price: 180 })
    });
    const patchData = await patchRes.json();
    assert(
      patchRes.status === 200 && patchData.data.price === 180,
      `PATCH /api/v1/products/${createdId} cập nhật giá thành công lên 180`
    );

    // Test 9: Delete Product (DELETE)
    const deleteRes = await fetch(`${baseUrl}/api/v1/products/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(deleteRes.status === 204, `DELETE /api/v1/products/${createdId} trả về đúng 204 No Content`);

    // Test 10: 404 Route
    const notFoundRes = await fetch(`${baseUrl}/api/v1/non-existent-route`);
    assert(notFoundRes.status === 404, "Truy cập route không tồn tại trả về đúng 404 Not Found");
  } catch (err) {
    console.error("Lỗi thực thi test:", err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n📊 Kết quả kiểm thử: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
