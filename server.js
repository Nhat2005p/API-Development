require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 RESTful API Server is running on port ${PORT}`);
  console.log(`📄 Swagger UI Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Base URL:             http://localhost:${PORT}/api/v1`);
  console.log(`🩺 Health Check:             http://localhost:${PORT}/health`);
  console.log("==================================================");
});

module.exports = server;
