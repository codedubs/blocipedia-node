
const User = require("../../src/db/models").User;

module.exports = {


  validateUsers(req, res, next) { //console.log(req)

    if (req.method === "POST") {

      req.checkBody("email", "must be a valid email").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 4});
      req.checkBody("passwordConfirmation", "and password must match").optional().matches(req.body.password);
      req.checkBody("email").custom(value => {
        return User.findOne( {where: {email: value}} ).then(user =>  {
          if(user) {
          throw new Error('E-mail already in use');
          }
        })
      });
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
      return next()
    }

  }

}
