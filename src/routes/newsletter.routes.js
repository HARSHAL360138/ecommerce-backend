const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletter.controller");

router.post("/subscribe", newsletterController.subscribe);
router.get("/", newsletterController.getAllSubscribers);
router.put("/:id", newsletterController.updateSubscriber);
router.delete("/:id", newsletterController.deleteSubscriber);

module.exports = router;
