const userQueries = require("../db/queries.users.js");
const sendMail = require("./emailController.js");
//const passport = require("passport");




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
<<<<<<< HEAD
      if(err) {
        req.flash("error", err);
        res.redirect("/users/signup")
      } else {
        sendMail(user.email, "Welcome to blocipedia", "You've signed up!");
        req.flash("notice", "You've successfully signed up");
=======
     if(err) {
        req.flash("error", err);
        res.redirect("/users/signup")
      } else {
        sendMail(user.email);
        req.flash("notice", "You've successfully signed up!");
>>>>>>> checkpoint-2-usersignup
        res.redirect("/");
      }
    })
  }

/*
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },


  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if(!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("TESTING TEST TEST")
    res.redirect("/");
  } */






}
