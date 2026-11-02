/**
 * Middleware bắt lỗi 404 Not Found khi gọi sai Endpoint
 */
const notFound = (req, res, next) => {
  const error = new Error(`Resource không tồn tại tại URL: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: error.message,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware bắt lỗi tập trung (Global Error Handler)
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: err.message || "Đã xảy ra lỗi máy chủ nội bộ (Internal Server Error).",
    errors: err.errors || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  notFound,
  errorHandler
};
