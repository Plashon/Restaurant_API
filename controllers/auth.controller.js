const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// หลักการ one way encryption คือ นำ encrypt ของสิ่งที่กรอกมาเทียบกัน

// Resgister a new user
exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400).send({
      message: "Please provide all required fields!",
    });
    return;
  }

  //   Prepare user data
  const newUser = {
    userName: userName,
    email: email,
    password: bcrypt.hashSync(password, 5),
  };

  //   Save user in the DB
  await User.create(newUser)
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({ where: { name: { [Op.or]: req.body.roles } } }).then(
          (roles) => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User registered successfully!" });
            });
          }
        );
      } else {
        // Set default role to user
        user.setRoles([3]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while registering a new user!",
      });
    });
};

// Sign in User
exports.signin = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    res.status(400).send({ message: "Please provide all required fields!" });
    return;
  }
  await User.findOne({ where: { userName: userName } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        // http code 401 = unAutherized
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }
      // expiresIn 86400 = 1d
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });
      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          userName: user.userName,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while registering a new user!",
      });
    });
};
