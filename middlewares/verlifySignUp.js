const User = require("../models/user.model");
const Role = require("../models/role.model");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  await User.findOne({
    where: {
      username: req.body.userName,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({ message: "failed! Username is already in use" });
      return;
    }
    User.findOne({
      where: { email: req.body.email },
    }).then((user) => {
      if (user) {
        res.status(400).send({ message: "failed! Email is already in use" });
        return;
      }
      next();
    });
  });
};

// check Role Are Valid
checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    Role.findAll({
      where: {
        name: { [Op.or]: req.body.roles },
      },
    }).then((roles) => {
      if (roles.length !== req.body.roles.length) {
        res.status(400).send({ message: "Failed! Role dose not exist" });
        return;
      }
      next();
    });
  } else {
    next();
  }
};

const verifySignUp ={
    checkRolesExisted,
    checkDuplicateUsernameOrEmail,
}

module.exports = verifySignUp;