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

/*
  addCollab(user, callback) {
    return Collaborator.create({
      email: user.email,
      role: user.role
    })
    .then(user => {
      callback(null, user);
    })
    .catch(err => {
      callback(err);
    });
  },


  removeCollab(user, callback) {
    return Collaborator.findByPk(user.id)
    .then(user => {
      user.destroy()
      .then(res => {
        callback(null, user);
      })
    })
    .catch(err => {
      callback(err);
    })
  }*/

}
