const User = require("./models").User;
const bcrypt = require("bcryptjs");




module.exports = {

  createUser(newUser, callback) {

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgradeUser(id) {
    return User.findByPk(id)
    .then(user => {
      user.update({
        role: "premium"
      })
      return user;
    });
  },

  downgradeUser(id) {
    return User.findByPk(id)
    .then(user => {
      user.update({
        role: "standard"
      });
      return user;
    })
  }

}
