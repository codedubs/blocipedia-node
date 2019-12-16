'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    },
    access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
  };

  User.prototype._isAdmin = function() {
    return this.role === "admin";
  };

  User.prototype._isOwner = function() {
    return this.role === "owner"
  };

  User.prototype._isStandard = function() {
    return this.role === "standard"
  };

  User.prototype._isPremium = function() {
    return this.role === "premium";
  };

  return User;
};
