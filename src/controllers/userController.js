/*const userQueries = require("../db/queries.users.js");
const sendMail = require("./emailController.js");


module.exports = {

  signUp(req, res, next) {
    res.render("users/signup")
  },


  create(req, res, next) {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err) { console.log(err)
        req.flash("that email already exists", err);
        res.redirect("/users/signup")
      } else {
        sendMail(user.email, "Welcome to blocipedia", "just a string");
        req.flash("notice", "You've successfully signed up");
        res.redirect("/");
      }
    });
  }






}

*/
