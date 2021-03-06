const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");



module.exports = {

  getAllWikis(callback) {
    return Wiki.findAll()
    .then(wikis => {
      callback(null, wikis);
    })
    .catch(err => {
      callback(err);
    });
  },


  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    });
  },


  addPrivateWiki(newPrivateWiki, callback) {
    return Wiki.create({
      title: newPrivateWiki.title,
      body: newPrivateWiki.body,
      private: newPrivateWiki.private,
      userId: newPrivateWiki.userId
    })
    .then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    });
  },


  getWiki(id, callback) {
    return Wiki.findByPk(id)
    .then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    });
  },

  deleteWiki(req, callback) {
    return Wiki.findByPk(req.params.id)
    .then(wiki => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if(authorized) {
        wiki.destroy()
        .then(res => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch(err => {
      callback(err);
    });
  },


  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id)
    .then(wiki => {
      if(!wiki) {
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized) {
        wiki.update(updatedWiki,
        {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }

    });
  },

  updatePrivate(req, callback) {
    return Wiki.findAll({
      where: {
        userId: req.user.id
      }
    })
    .then(wikis => {
      wikis.forEach(wiki => {
        wiki.update({ private: false });
      });
    });
  },

  getWikiCollab(wikiId, callback) {
    return Collaborator.findAll({
     where: {
        wikiId: wikiId
      }
    })
    .then(collaborators => { console.log(collaborators)
      callback(null, collaborators)
    })
    .catch(err => {
      callback(err)
    });

  },


  getUserCollaborations(currentUser, callback) {
    return Collaborator.findAll({
      where: {
        userId: currentUser
      }
    })
    .then(collaborations => { console.log(collaborations)
      callback(null, collaborations)
    })
    .catch(err => {
      callback(err)
    });
  }


}
