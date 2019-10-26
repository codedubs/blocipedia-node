

module.exports = {


  validateUsers(req, res, next) {
    const email = req.body.email;

    if (req.method === "POST") {

      req.checkBody("email", "must be a valid email").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();

    if (errors) {
      req.flash("error", errors);
      return res.redirect("/users/signup")
    } else {
      return next();
    }

  }

}
