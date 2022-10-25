const router = require("express").Router();
const { signUp } = require("./user.controller");

router.route("/").post(signUp); // sign up
router.route("/login").post();
router.route("/logout").post();
router.route("/:userName").get().put().delete();

module.exports = router;
