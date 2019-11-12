const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("Wiki", () => {

  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then(res => {
      User.create({
        email: "wiki@wiki.com",
        password: "tester"
      })
      .then(user => {
        this.user = user;

        Wiki.create({
          title: "Origami",
          body: "It is the art of paper folding",
          private: false,
          userId: this.user.id
        })
        .then(wiki => {
          this.wiki = wiki;
          done();
        })
      })
      .catch(err => {
        console.log(err);
        done();
      });
    });
  });


  describe("#create()", () => {

    it("should create a wiki object with a title, body, and assigned user", (done) => {
      Wiki.create({
        title: "Lady Gaga",
        body: "An American singer, songwriter, and actress.",
        private: false,
        userId: this.user.id
      })
      .then(wiki => {
        expect(wiki.title).toBe("Lady Gaga");
        expect(wiki.body).toContain("An American singer, songwriter, and actress.");
        expect(wiki.userId).toBe(this.user.id);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
    });

    it("should not create a wiki object with missing title, body, or assigned user", (done) => {
      Wiki.create({
        title: "Fuyu Persimmon",
      })
      .then(wiki => {
        done();
      })
      .catch(err => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      })
    });

  });


  describe("#setUser()", () => {

    it("should associate a Wiki and a user together", (done) => {
      User.create({
        email: "user@example.com",
        password: "password"
      })
      .then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);

        this.wiki.setUser(newUser)
        .then(wiki => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });




  /*describe("#getWikis()", () => {

  })*/



})
