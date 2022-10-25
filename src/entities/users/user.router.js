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
router.route("/:username").get(getUser).patch(updateUser).delete(deleteUser); // we used patch because we aren't modifying the entire data

module.exports = router;
