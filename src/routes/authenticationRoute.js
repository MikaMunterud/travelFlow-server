const express = require("express");
const {
  userRegister,
} = require("../controllers/authenticationRoute/userRegister");

const { userLogin } = require("../controllers/authenticationRoute/userLogin");
const {
  checkAuthentication,
} = require("../controllers/middleware/checkAuthentication");
const { userLogout } = require("../controllers/authenticationRoute/userLogout");
const { userDelete } = require("../controllers/authenticationRoute/userDelete");
const { isLoggedIn } = require("../controllers/authenticationRoute/isLoggedIn");


const authenticationRoute = express.Router();

/*
 * This route makes it possible for a user to log in to this application.
 */
authenticationRoute.post("/login", userLogin);

/*
 * This route makes it possible for a user to register another user to this application.
 */
authenticationRoute.post("/register", userRegister);

authenticationRoute.post("/logout", checkAuthentication, userLogout);

/*
 * This route makes it possible for a user to delete themselves from this application.
 */
authenticationRoute.delete("/deleteUser", checkAuthentication, userDelete);

authenticationRoute.get("/", checkAuthentication, isLoggedIn);

exports.authenticationRoute = authenticationRoute;
