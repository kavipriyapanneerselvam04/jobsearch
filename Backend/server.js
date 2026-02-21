const express = require("express");
const cors = require("cors");
const path = require("path");

// 🔹 DB CONNECTION
require("./src/models/db");

// 🔹 ROUTES
const userRoutes = require("./src/routes/userRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");

// 🔹 SWAGGER
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(path.join(__dirname, "src/swagger.yaml"));

const app = express();

// 🔹 MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 STATIC FILE SERVE
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// 🔹 API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);

// 🔹 ROOT ROUTE
app.get("/", (req, res) => {
  res.send("✅ Resume Job Portal API is running");
});

// 🔹 SWAGGER ROUTE
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  "/profile",
  express.static(path.join(__dirname, "src/uploads/profile"))
);

// 🔹 START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);
});
