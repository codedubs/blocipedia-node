const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;



module.exports = {

  showAllUsers(callback) {
    return User.findAll()
    .then(users => { //console.log(users)
      callback(users);
    })
    .catch(err => {
      callback(err)
    })
  },

  getWiki(id, callback) {
    return Wiki.findByPk(id)
    .then(wiki => {
      callback(null, wiki)
    })
    .catch(err => {
      callback(err);
    });
  },

  shareAccess(newCollaborator, callback) {
    return Collaborator.create({
      userId: newCollaborator.userId,
      wikiId: newCollaborator.wikiId,
      access: true
    })
    .then(collaborator => {
      callback(null, collaborator)
    })
    .catch(err => {
      callback(err);
    });
  },

  updateAccess(newCollaborator) {
    return User.findByPk(newCollaborator.userId)
    .then(user => {
      user.update({
        access: true
      })
      return user;
    });
  },


  shareRemove(excollaborator, callback) {
    return Collaborator.findByPk(excollaborator)
    .then(excollaborator => { //console.log(excollaborator)
      collaborator.update({
        access: false
      })
    })
    .then(res => {
      callback(null, collaborator)
    })
    .catch(err => {
      callback(err);
    });
  },


  removeAccess(excollaborator) {
    return User.findByPk(excollaborator.userId)
    .then(user => {
      user.update({
        access: false
      })
      return user;
    });
  }

}
