// routes/moderationRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { checkImage } = require("../controller/moderationController.js");

const upload = multer({ dest: "uploads/" });

router.post("/check-image", upload.single("image"), checkImage);

module.exports = router;