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
        password: "tester",
        role: "standard"
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

//standard user
  describe("standard user performing CRUD actions for Wiki", () => {

    beforeEach(done => {
      User.create({
        email: "standard@example.com",
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


//end of wiki routes
});



describe("routes : privateWikis", () => {

    beforeEach(done => {
      this.user;
      this.wiki;

      sequelize.sync({force: true}).then(res => {
        User.create({
          email: "user@example.com",
          password: "password",
          role: "admin"
        }).
        then(user => {
          this.user;

          Wiki.create({
            title: "The Diary of Anne Frank",
            body: "A book from the past.",
            private: true,
            userId: this.user.id
          })
          .then(wiki => {
            this.wiki;
            done();
          });
        });
      });
    });

//admin user
    describe("admin member performing CRUD actions on private Wikis", () => {

      beforeEach(done => {

        User.create({
          email: "admin@example.com",
          password: "password",
          role: "admin"
        })
        .then(user => {
          request.get({
            url: `http://localhost:3000/auth/fake`,
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


      describe("GET /wikis/private", () => {

        it("should render a new private Wiki form", (done) => {
          request.get(`${base}private`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Private Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/createPrivate", () => {

        it("should create a new Wiki entry with private setting and redirect", (done) => {
          const options = {
            url: `${base}createPrivate`,
            form: {
              private: true,
              title: "Cliffhanger",
              body: "A movie starring Stalone."
            }
          };

          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "Cliffhanger"} })
            .then((wiki) => {
              expect(err).toBeNull();
              expect(res.statusCode).toBe(303);
              expect(wiki.title).toBe("Cliffhanger");
              expect(wiki.body).toBe("A movie starring Stalone.");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });

      describe("GET /wikis/:id", () => {

        it("should render a view of the selected private wiki", (done) => {
          request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("A book from the past.");
            done();
          });
        })
      });

      describe("GET /wikis/:id/edit", () => {

        it("should render a form for wiki edit", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            //expect(body).toContain("A book from the past.");
            expect(body).toContain("Edit Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/:id/update", () => {

        it("should update the selected Wiki with new values", (done) => {
          const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "Anne Frank",
              body: "The story of Anne Frank",
              private: true
            }
          }

          request.post(options, (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({where: { id: this.wiki.id }})
            .then(wiki => {
              expect(wiki.title).toBe("Anne Frank");
              done();
            });
          });
        });
      });

      describe("POST /wikis/:id/destroy", () => {

        it("should delete the selected Wiki and redirect", (done) => {
          Wiki.findAll()
          .then(wikis => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikis.length).toBe(1);

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

    });

//premium user
    describe("premium member performing CRUD actions on private Wikis", () => {

      beforeEach(done => {

        User.create({
          email: "premium@example.com",
          password: "password",
          role: "premium"
        })
        .then(user => {
          request.get({
            url: `http://localhost:3000/auth/fake`,
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


      describe("GET /wikis/private", () => {

        it("should render a new private Wiki form", (done) => {
          request.get(`${base}private`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Private Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/createPrivate", () => {
        it("should create a new Wiki entry with private setting and redirect", (done) => {
          const options = {
            url: `${base}createPrivate`,
            form: {
              private: true,
              title: "Cliffhanger",
              body: "A movie starring Stalone."
            }
          };

          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "Cliffhanger"} })
            .then((wiki) => {
              expect(err).toBeNull();
              expect(res.statusCode).toBe(303);
              expect(wiki.title).toBe("Cliffhanger");
              expect(wiki.body).toBe("A movie starring Stalone.");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });

      describe("GET /wikis/:id", () => {

        it("should render a view of the selected private wiki", (done) => {
          request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("A book from the past.");
            done();
          });
        })
      });

      describe("GET /wikis/:id/edit", () => {

        it("should render a form for wiki edit", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            //expect(body).toContain("A book from the past.");
            expect(body).toContain("Edit Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/:id/update", () => {

        it("should update the selected Wiki with new values", (done) => {
          const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "Anne Frank",
              body: "The story of Anne Frank",
              private: true
            }
          }

          request.post(options, (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({where: { id: this.wiki.id }})
            .then(wiki => {
              expect(wiki.title).toBe("Anne Frank");
              done();
            });
          });
        });
      });

      describe("POST /wikis/:id/destroy", () => {

        it("should delete the selected Wiki and redirect", (done) => {
          Wiki.findAll()
          .then(wikis => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikis.length).toBe(1);

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

    });


  });
