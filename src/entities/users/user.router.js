const router = require("express").Router();
const {
  signUp,
  logIn,
  getUser,
  updateUser,
  deleteUser,
} = require("./user.controller");

router.route("/").post(signUp); // sign up
router.route("/login").post(logIn);
router.route("/logout").post();
router.route("/:username").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
