const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

// 1. Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health check & Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chào mừng bạn đến với RESTful API Development Demo (NodeJS Course)!",
    version: "1.0.0",
    docsUrl: "/api-docs",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 3. Swagger OpenAPI UI Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 4. API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

// 5. Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
