const config = require("../config/auth.config");
const db = require("../models/");
const User = db.User;
const Role = db.Role;
const jet = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//regester
exports.singup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "plese provide all require fields ",
    });
    return;
  }

  //prepare
  const newUser = {
    userName: username,
    email: email,
    password: bcrypt.hashSync(password, 5),
  };

  //save user in database
  await User.create(newUser)
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: { [Op.or]: req.body.roles },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: "user register successfully!!",
            });
          });
        });
      } else {
        //set defautl role to user ID =1
        user.setRoles([1]).then(() => {
          res.send({
            message: "user register successfully!!",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message || "Somethimg error occured whle register a new user",
      });
    });
};
