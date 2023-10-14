const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("home page");
});

router.get("/menu", (req, res) => {
  res.send("you are in the Menu page");
});

router.get("/community", (req, res) => {
  res.send("we are in the commonity page");
});

module.exports = router;
