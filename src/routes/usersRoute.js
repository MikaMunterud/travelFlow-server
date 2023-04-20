const express = require("express");
const { getAllUsers } = require("../controllers/usersRoute/getAllUsers");

const usersRoute = express.Router();

usersRoute.get("/allUsers", getAllUsers);

exports.usersRoute = usersRoute;
