const router = require("express").Router();
const {
  signUp,
  logIn,
  getUser,
  updateUser,
  deleteUser,
} = require("./user.controller");
const authMiddleware = require("../../utils/authentication middleware/auth"); // token authentication

router.route("/").post(signUp); // sign up
router.route("/login").post(logIn);
router
  .route("/:username")
  .get(getUser)
  .patch(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser); // we used patch because we aren't modifying the entire data

module.exports = router;
