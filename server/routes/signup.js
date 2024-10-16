const express = require("express");
const signupRouteController = require("../controllers/signupControllers");
const route = express.Router();

route.post("/api/register", signupRouteController);

module.exports = route;
