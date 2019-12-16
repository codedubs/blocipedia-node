const express = require('express');
const router = express.Router();
const helper = require("../auth/helpers");
const wikiController = require('../controllers/wikiController');
const validation = require("./validation");
const userController = require("../controllers/userController");
const collabController = require("../controllers/collabController");



router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", helper.ensureAuthenticated, validation.validateWikis, wikiController.create);
router.get("/wikis/private", wikiController.private);
router.post("/wikis/createPrivate", helper.ensureAuthenticated, wikiController.createPrivate);

router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", wikiController.update);

router.get("/wikis/:id/share", collabController.share);
router.post("/wikis/:id/collabAdd", collabController.collabAdd);
router.get("/wikis/:id/share", collabController.share);
router.post("/wikis/:id/collabRemove", collabController.collabRemove);




module.exports = router;
