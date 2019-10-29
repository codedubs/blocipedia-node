
<<<<<<< HEAD
=======
const User = require("../../src/db/models").User;
>>>>>>> checkpoint-2-usersignup

module.exports = {


<<<<<<< HEAD
  validateUsers(req, res, next) {
    //const email = req.body.email;
=======
  validateUsers(req, res, next) { //console.log(req)
>>>>>>> checkpoint-2-usersignup

    if (req.method === "POST") {

      req.checkBody("email", "must be a valid email").isEmail();
<<<<<<< HEAD
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
=======
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 4});
      req.checkBody("passwordConfirmation", "and password must match").optional().matches(req.body.password);
      req.checkBody("email").custom(value => {
        return User.findOne( {where: {email: value}} ).then(user =>  {
          if(user) {
          req.flash('E-mail already in use');
          }
        })
      });
>>>>>>> checkpoint-2-usersignup
    }

    const errors = req.validationErrors();
//console.log(errors)
    //const result = validationResult(req);
    //const hasErrors = !result.isEmpty();
/*
    if (typeof errors !== 'undefined') { //console.log(errors)

      req.flash("error", errors);
      return res.redirect("/users/signup")
    }  else {

      return next()
    } */



    if(errors) {
      req.flash("error", errors);
      return res.redirect("/users/signup")
    } else {
<<<<<<< HEAD
      return next();
    }

=======
      return next()
    }
>>>>>>> checkpoint-2-usersignup
  }

}
