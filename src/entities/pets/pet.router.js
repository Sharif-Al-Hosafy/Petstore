const router = require("express").Router();
const {
  addPet,
  searchByStatus,
  updatePet,
  deletePet,
  getOnePet,
  uploadPetImage,
  searchByTag,
  submitBid,
  getAllBids,
  auction,
} = require("./pet.controller");
const authMiddleware = require("../../utils/authentication middleware/auth"); // token authentication

router.route("/").post(authMiddleware, addPet);

router
  .route("/:id")
  .get(getOnePet)
  .patch(authMiddleware, updatePet)
  .delete(authMiddleware, deletePet); // get, update or delete existing pet

router.route("/:id/uploadImage").post(authMiddleware, uploadPetImage); // uploading pet image

router.route("/search/tag").get(searchByTag);
router.route("/search/status").get(searchByStatus); // post for adding pet && get for search by status and or tag

// bidding
router
  .route("/bid/:petId")
  .post(authMiddleware, submitBid)
  .get(authMiddleware, getAllBids);

// Generalized second-price auction
router.route("/auction/:id").get(authMiddleware, auction);

module.exports = router;
