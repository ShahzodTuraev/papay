const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

/********************
 *     REST API     *
 ********************/

// member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

// others
router.get("/menu", (req, res) => {
  res.send("you are in the Menu page");
});

router.get("/community", (req, res) => {
  res.send("we are in the commonity page");
});

module.exports = router;
