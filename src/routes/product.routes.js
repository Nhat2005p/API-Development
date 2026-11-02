const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");

// GET /api/v1/products - Lấy danh sách sản phẩm (Public)
router.get("/", productController.getAllProducts);

// GET /api/v1/products/:id - Lấy chi tiết sản phẩm (Public)
router.get("/:id", productController.getProductById);

// POST /api/v1/products - Tạo mới sản phẩm (Protected: Yêu cầu đăng nhập)
router.post("/", authenticateJWT, productController.createProduct);

// PUT /api/v1/products/:id - Thay thế toàn bộ sản phẩm (Protected)
router.put("/:id", authenticateJWT, productController.updateProductFull);

// PATCH /api/v1/products/:id - Cập nhật một phần sản phẩm (Protected)
router.patch("/:id", authenticateJWT, productController.updateProductPartial);

// DELETE /api/v1/products/:id - Xóa sản phẩm (Protected: Chỉ Admin mới có quyền)
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), productController.deleteProduct);

module.exports = router;
