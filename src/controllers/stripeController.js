const userQueries = require("../db/queries.users.js")
const stripe = require('stripe')('sk_test_QrbrGP8sz70hvXXa0emIVb9C00Dbgc2ogK');


module.exports = {


  checkout(req, res, next) {
    res.render("users/stripe_form");
  },


  charge(req, res, next) {
    console.log('stripe information received: ', req.user);

    if(req.user.role === 'premium') {
      req.flash("notice", "error");
      res.redirect("/wikis")
    } else { console.log(req.body)

      stripe.customers.create({
        email: req.body.email,
        id: req.user.id,
        source: req.body.stripeToken
      })
      .then(customer => {
        stripe.charges.create({
          amount: 15*100,
          currency: 'usd',
          customer: customer.id
        })
        .then(() => {
          userQueries.upgradeUser(customer.id);
          req.flash("notice", "You've successfully upgraded to Premium!");
          res.redirect("/")
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
    }
  },


  manage(req, res, next) {
    res.render("users/account");
  },


  downgrade(req, res, next) {

    if(!req.user) {
      req.flash("notice", "error");
      res.redirect("/wikis");
    } else {
      userQueries.downgradeUser(req.user.id);
      req.flash("notice", "You are now a Standard user");
      res.redirect("/");
    }
  }




}
