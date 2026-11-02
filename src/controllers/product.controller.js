// Dữ liệu mẫu ban đầu
let products = [
  {
    id: 1,
    title: "MacBook Pro 16 inch M3 Max",
    category: "laptops",
    price: 3499,
    stock: 15,
    rating: 4.9,
    description: "Máy tính xách tay cao cấp cho lập trình viên và nhà sáng tạo.",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-01-10T08:00:00.000Z"
  },
  {
    id: 2,
    title: "Dell XPS 15 OLED",
    category: "laptops",
    price: 2199,
    stock: 20,
    rating: 4.7,
    description: "Màn hình 3.5K OLED tuyệt đẹp, hiệu năng xử lý đa nhiệm mượt mà.",
    createdAt: "2026-01-15T09:30:00.000Z",
    updatedAt: "2026-01-15T09:30:00.000Z"
  },
  {
    id: 3,
    title: "Keychron Q1 Pro Wireless Custom",
    category: "accessories",
    price: 199,
    stock: 50,
    rating: 4.8,
    description: "Bàn phím cơ núm xoay full nhôm CNC, kết nối không dây đa thiết bị.",
    createdAt: "2026-02-01T10:15:00.000Z",
    updatedAt: "2026-02-01T10:15:00.000Z"
  },
  {
    id: 4,
    title: "Logitech MX Master 3S",
    category: "accessories",
    price: 99,
    stock: 80,
    rating: 4.9,
    description: "Chuột công thái học hàng đầu cho dân văn phòng và lập trình viên.",
    createdAt: "2026-02-05T14:20:00.000Z",
    updatedAt: "2026-02-05T14:20:00.000Z"
  },
  {
    id: 5,
    title: "LG UltraFine 27 inch 4K Monitor",
    category: "monitors",
    price: 499,
    stock: 25,
    rating: 4.6,
    description: "Màn hình chuyên đồ họa với độ phủ màu 99% DCI-P3.",
    createdAt: "2026-02-12T11:00:00.000Z",
    updatedAt: "2026-02-12T11:00:00.000Z"
  }
];

let nextId = 6;

/**
 * Lấy danh sách sản phẩm có phân trang, lọc và tìm kiếm (GET /api/v1/products)
 * Hỗ trợ Query Params: page, limit, search, category, minPrice, maxPrice, sort
 */
const getAllProducts = (req, res, next) => {
  try {
    let result = [...products];
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    // 1. Lọc theo search (title hoặc description)
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // 2. Lọc theo category
    if (category) {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Lọc theo khoảng giá
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // 4. Sắp xếp (sort: price_asc, price_desc, rating_desc)
    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      result.sort((a, b) => b.rating - a.rating);
    }

    // 5. Phân trang (Pagination)
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Lấy danh sách sản phẩm thành công.",
      pagination: {
        currentPage: pageNum,
        totalPages,
        limit: limitNum,
        totalItems,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      data: paginatedItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết một sản phẩm theo ID (GET /api/v1/products/:id)
 */
const getProductById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Không tìm thấy sản phẩm có ID = ${req.params.id}.`
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo mới một sản phẩm (POST /api/v1/products)
 * Yêu cầu quyền đăng nhập (Bearer Token)
 */
const createProduct = (req, res, next) => {
  try {
    const { title, category, price, stock, description } = req.body;

    // Validation
    if (!title || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Thiếu thông tin bắt buộc: title, category, price."
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(422).json({
        success: false,
        statusCode: 422,
        message: "Giá sản phẩm (price) phải là một số dương hợp lệ."
      });
    }

    const newProduct = {
      id: nextId++,
      title,
      category,
      price,
      stock: stock !== undefined ? Number(stock) : 0,
      rating: 5.0,
      description: description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user ? req.user.email : "anonymous"
    };

    products.push(newProduct);

    // Chuẩn RESTful: Đặt Location header trỏ tới URI tài nguyên vừa tạo
    res.setHeader("Location", `/api/v1/products/${newProduct.id}`);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Tạo sản phẩm mới thành công.",
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thay thế toàn bộ thông tin sản phẩm (PUT /api/v1/products/:id)
 */
const updateProductFull = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Không tìm thấy sản phẩm có ID = ${req.params.id} để cập nhật.`
      });
    }

    const { title, category, price, stock, description } = req.body;

    if (!title || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Phương thức PUT yêu cầu cung cấp toàn bộ thuộc tính: title, category, price."
      });
    }

    products[index] = {
      id,
      title,
      category,
      price,
      stock: stock !== undefined ? Number(stock) : products[index].stock,
      rating: products[index].rating,
      description: description || "",
      createdAt: products[index].createdAt,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user ? req.user.email : "anonymous"
    };

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cập nhật toàn diện (PUT) sản phẩm thành công.",
      data: products[index]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật một phần thông tin sản phẩm (PATCH /api/v1/products/:id)
 */
const updateProductPartial = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Không tìm thấy sản phẩm có ID = ${req.params.id} để cập nhật.`
      });
    }

    const updates = req.body;

    // Không cho phép thay đổi ID
    delete updates.id;
    delete updates.createdAt;

    Object.assign(product, updates, {
      updatedAt: new Date().toISOString(),
      updatedBy: req.user ? req.user.email : "anonymous"
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cập nhật một phần (PATCH) sản phẩm thành công.",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa một sản phẩm (DELETE /api/v1/products/:id)
 * Trả về 204 No Content
 */
const deleteProduct = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Không tìm thấy sản phẩm có ID = ${req.params.id} để xóa.`
      });
    }

    products.splice(index, 1);

    // Chuẩn REST: 204 No Content không kèm body
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductFull,
  updateProductPartial,
  deleteProduct
};
