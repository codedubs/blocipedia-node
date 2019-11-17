const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;




describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        email: "wiki@wiki.com",
        password: "tester"
      }).
      then(user => {
        this.user = user;

        Wiki.create({
          title: "Aloe",
          body: "A flowering succulent plant",
          private: false,
          userId: this.user.id
        })
        .then(wiki => {
          this.wiki = wiki;
          done();
        })
      });
    });
  });


  describe("admin user performing CRUD actions for Wiki", () => {

    beforeEach(done => {
      User.create({
        email: "admin@example.com",
        password: "12345",
        role: "admin"
      })
      .then(user => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });


    describe("GET /wikis", () => {

      it("should return all Wikis with a status code 200", (done) => {

        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });


    describe("GET /wikis/new", () => {

      it("should render a new Wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });


    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Computer Science",
          body: "Talking about computers here",
          private: false
        }
      };

      it("should create a new Wiki and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "Computer Science" } })
          .then(wiki => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Computer Science");
            expect(wiki.body).toBe("Talking about computers here");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        });
      });
    });


    describe("GET /wikis/:id", () => {

      it("should render a view with the selected Wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll()
        .then(wikis => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });


    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit Wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/update", () => {

      it("should update the Wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "CS Fundamentals",
            body: "Talking about computers here",
            private: false
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id: this.wiki.id }
          })
          .then(wiki => {
            expect(wiki.title).toBe("CS Fundamentals");
            done();
          });
        });
      });
    });

  });




  describe("standard user performing CRUD actions for Wiki", () => {

    beforeEach(done => {
      User.create({
        email: "member@example.com",
        password: "12345",
        role: "standard"
      })
      .then(user => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email,
            //password: user.password
          }
        }, (err, res, body) => {
          done();
        });
      });
    });


    describe("GET /wikis", () => {

      ("it should return all Wikis with a status code 200", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });


    describe("GET /wikis/new", () => {

      it("should render a new Wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });


    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Computer Science",
          body: "Talking about computers here",
          private: false
        }
      };

      it("should create a new Wiki and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "Computer Science" } })
          .then(wiki => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Computer Science");
            expect(wiki.body).toBe("Talking about computers here");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        });
      });

    });


    describe("GET /wikis/:id", () => {

      it("should render a view with the selected Wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll()
        .then(wikis => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });


    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit Wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/update", () => {

      it("should update the Wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "CS Fundamentals",
            body: "Talking about computers here",
            private: false
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id: this.wiki.id }
          })
          .then(wiki => {
            expect(wiki.title).toBe("CS Fundamentals");
            done();
          });
        });
      });
    });

  });



  /*describe("Premium user performing CRUD actions for Wiki", () => {









    describe("GET /wikis", () => {

      ("it should return all Wikis with a status code 200", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });


    describe("GET /wikis/new", () => {

      it("should render a new Wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });


    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Computer Science",
          body: "Talking about computers here",
          private: false
        }
      };

      it("should create a new Wiki and redirect", (done) => {

        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "Computer Science" } })
          .then(wiki => {
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("Computer Science");
            expect(wiki.body).toBe("Talking about computers here");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        });
      });
    });


    describe("GET /wikis/:id", () => {

      it("should render a view with the selected Wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll()
        .then(wikis => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });


    describe("GET /wikis/:id/edit", () => { //sign out user here

      it("should render a view with an edit Wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Aloe");
          done();
        });
      });
    });


    describe("POST /wikis/:id/update", () => {

      it("should update the Wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "CS Fundamentals",
            body: "Talking about computers here",
            private: false
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id: this.wiki.id }
          })
          .then(wiki => {
            expect(wiki.title).toBe("CS Fundamentals");
            done();
          });
        });
      });
    });
  })
*/






});
