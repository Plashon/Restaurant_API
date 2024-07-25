const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;

//verify token
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //first verify
  if (!token) {
    return res.status(403).send({
      message: "no token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
//is Admin?
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i <= roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "unauthorized access, require admin role" });
    });
  });
};
//is mod
isMod = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i <= roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "unauthorized access, require  moderator" });
    });
  });
};
//is Admin Or Mod
isModOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i <= roles.length; i++) {
        if (roles[i].name === "moderator" || roles[i].name === "admin") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "unauthorized access, require admin or moderator" });
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMod,
  isModOrAdmin,
};
module.exports = authJwt;
