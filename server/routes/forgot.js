const express = require("express");
const forgotRouteController = require("../controllers/forgotControllers");
const route = express.Router();

route.post("/api/forgot-pass", forgotRouteController);

module.exports = route;
