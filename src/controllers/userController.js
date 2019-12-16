const userQueries = require("../db/queries.users.js");
const sendMail = require("./emailController.js");
const passport = require("passport");



module.exports = {

  signUp(req, res, next) {
    res.render("users/signup")
  },


  create(req, res, next) {

    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      role: req.body.role
    };

    userQueries.createUser(newUser, (err, user) => {
     if(err) { //console.log(err)
        req.flash("error", err);
        res.redirect("/users/signup");
      } else { console.log(201, user)
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        })
        //sendMail(user.email);
      }
    });
  },


  signInForm(req, res, next) {
    res.render("users/sign_in");
  },


  signIn(req, res, next) {
    passport.authenticate("local") (req, res, () => {
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
    req.flash("notice", "You have signed out")
    res.redirect("/");
  }

/*
  addCollaborator(req, res, next) {
    let collaborator = {
      email: req.body.email,
      role: req.body.role
    };

    userQueries.addCollab(collaborator, (err, user) => {
      if(err) {
        req.flash("An error occurred. Please try again.");
        res.redirect("/wikis");
      } else {
        req.flash("Success! Collaborator has been added.");
        res.redirect(`/wikis/${req.params.id}`)
      }
    })
  },


  removeCollaborator(req, res, next) {
    userQueries.removeCollab(req.user, (err, user) => {
      if(err) {
        req.flash("An error occurred. Please try again");
        res.redirect(`/wikis/${req.params.id}/edit`);
      } else {
        req.flash("Success. Collaborator has been removed.");
        res.redirect(`/wikis/${req.params.id}`)
      }
    })
  }
*/



}
