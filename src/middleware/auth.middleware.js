const jwt = require("jsonwebtoken");

/**
 * Middleware xác thực Bearer JWT Token
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Truy cập bị từ chối. Vui lòng cung cấp Bearer Token trong header 'Authorization'."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "supersecret_jwt_key_sun_internship_2026";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Token không hợp lệ hoặc đã hết hạn.",
      error: error.message
    });
  }
};

/**
 * Middleware phân quyền người dùng (Role-based Authorization)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Bạn không có quyền thực hiện hành động này (Forbidden)."
      });
    }
    next();
  };
};

/**
 * Middleware xác thực bằng API Key (Header: x-api-key)
 */
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validKey = process.env.API_KEY || "sun-secret-api-key-2026";

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "API Key không hợp lệ hoặc bị thiếu trong header 'x-api-key'."
    });
  }

  next();
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  authenticateApiKey
};
