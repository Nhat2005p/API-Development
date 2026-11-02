const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Dữ liệu mẫu người dùng (In-memory Database)
const users = [
  {
    id: "usr_1",
    name: "Minh Nhat (Admin)",
    email: "admin@sun-asterisk.com",
    // Password hash cho: "Admin@123"
    passwordHash: bcrypt.hashSync("Admin@123", 10),
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr_2",
    name: "Trainee User",
    email: "trainee@sun-asterisk.com",
    // Password hash cho: "Trainee@123"
    passwordHash: bcrypt.hashSync("Trainee@123", 10),
    role: "trainee",
    createdAt: new Date().toISOString()
  }
];

/**
 * Đăng ký tài khoản người dùng mới (POST /api/v1/auth/register)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation cơ bản
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Vui lòng cung cấp đầy đủ thông tin: name, email, password."
      });
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Email này đã được đăng ký trong hệ thống."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      passwordHash,
      role: role || "trainee",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Ký token JWT
    const secret = process.env.JWT_SECRET || "supersecret_jwt_key_sun_internship_2026";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      secret,
      { expiresIn }
    );

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Đăng ký tài khoản thành công.",
      data: {
        token,
        tokenType: "Bearer",
        expiresIn,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập lấy Bearer JWT Token (POST /api/v1/auth/login)
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Vui lòng nhập email và mật khẩu."
      });
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Email hoặc mật khẩu không chính xác."
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Email hoặc mật khẩu không chính xác."
      });
    }

    // Tạo payload JWT
    const secret = process.env.JWT_SECRET || "supersecret_jwt_key_sun_internship_2026";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Đăng nhập thành công.",
      data: {
        token,
        tokenType: "Bearer",
        expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin tài khoản hiện tại từ Token (GET /api/v1/auth/me)
 */
const getMe = async (req, res, next) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Không tìm thấy thông tin người dùng."
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  users
};
