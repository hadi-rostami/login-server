require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");

//routes
const loginRoute = require("./server/routes/login");
const registerRoute = require("./server/routes/signup");
const forgotRoute = require("./server/routes/forgot");

//middlewares
const checkContentType = require("./server/middleware/checkContentType");

// instanse express
const app = express();

// setting CORS
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  credentials: true,
  optionsSuccessStatus: 204,
};

// setting RateLimit
const rateLimitOptions = {
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
};

// middlewares setting
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(checkContentType);

// rate limiter
const limiter = rateLimit(rateLimitOptions);

// routes app
app.post("/api/login", limiter, loginRoute);
app.post("/api/register", registerRoute);
app.post("/api/forgot-pass", limiter, forgotRoute);

// Middleware error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
