const express = require("express");
const loginRouteController = require("../controllers/loginControllers");
const route = express.Router();

route.post("/api/login", loginRouteController);

module.exports = route;

