const config = require("../config/auth.config");
const db = require("../models/");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//regester
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "please provide all require fields ",
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
          error.message || "Something error occurred while register a new user",
      });
    });
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "please provide all require fields ",
    });
    return;
  }
  //select userName by username
  await User.findOne({ where: { userName: username } }).then((user) => {
    if (!user) {
      res.status(404).send({
        message: "User not found",
      });

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password",
        });
      }
      //แปล่งๆ

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "86400",
      });
      const autherities = [];
      user
        .getRoles()
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            autherities.push("ROLES_" + roles[i].name.toUpperCase());
          }
          res.status(200).send({
            id:user.id,
            username: user.userName,
            email: user.email,
            roles: autherities,
            accessToken: token,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: error.message || "Something error occurred while get user",
          });
        });
    }
  });
};
