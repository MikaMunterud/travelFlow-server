const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//middleware
const {
  checkAuthentication,
} = require("../controllers/middleware/checkAuthentication");

//Routes
const { authenticationRoute } = require("../routes/authenticationRoute");
const { followingRoute } = require("../routes/followingRoute");
const { postsRoute } = require("../routes/postsRoute");

server.use(express.json());
server.use(cookieParser());

server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use("/authentication", authenticationRoute);

server.use("/following", followingRoute);

exports.server = server;
