
const collabQueries = require("../db/queries.collaborators.js");
const userQueries = require("../db/queries.users.js");



module.exports = {

  share(req, res, next) {
    collabQueries.getWiki(req.params.id, (err, wiki) => {
      if(err) { console.log(err)
        res.redirect("/wikis");
      } else {
        collabQueries.showAllUsers(users => {
          res.render("wikis/share", {wiki, users});
        })
      }
    })
  },


  collabAdd(req, res, next) {
    collabQueries.getWiki(req.params.id, (err, wiki) => {
      if(err) { console.log(err)
        res.redirect("/wikis");
      } else {
        Object.entries(req.body).forEach(([key,value])=> {
          //console.log(`${key}:${value}`)
          const newCollaborator = {
            userId: `${key}`,
            wikiId: req.params.id,
            access: true
          };
//console.log(req.body[`${key}`])
          collabQueries.updateAccess(newCollaborator);
          collabQueries.shareAccess(newCollaborator, (err, collaborator) => {
              if(err) { console.log(err)
                req.flash("error")
              } else { //console.log(req.body.name)
                req.flash("notice", "Collaborator successfully has been added.")
                res.redirect(`/wikis/${wiki.id}/share`)
              }
          });
        });
      }
    });
  },

  collabRemove(req, res, next) {
    collabQueries.getWiki(req.params.id, (err, wiki) => {
      if(err) {
        res.redirect("/wikis");
      } else {
        Object.entries(req.body).forEach(([key,value]) => {
          const excollaborator = {
            userId: `${key}`,
            wikiId: req.params.id,
            access: false
          };
          collabQueries.removeAccess(excollaborator);
          collabQueries.shareRemove(excollaborator.userId, (err, collaborator) => {
            if(err) {
              req.flash("notice", "Collaborator(s) have been removed.")
              res.redirect(`/wikis/${wiki.id}/share`)
            } else {
              req.flash("notice", "Collaborator has been removed.")
              res.redirect(`/wikis/${wiki.id}/share`)
            }
          });
        });
      }
    });
  }

}
