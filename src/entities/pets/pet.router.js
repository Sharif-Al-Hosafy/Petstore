const router = require("express").Router();
const {
  addPet,
  searchPet,
  updatePet,
  deletePet,
  getOnePet,
  uploadPetImage,
} = require("./pet.controller");

router.route("/").post(addPet).get(searchPet); // post for adding pet && get for search by status and or tag
router.route("/:id").get(getOnePet).patch(updatePet).delete(deletePet); // update or delete existing pet
router.route("/:id/uploadImage").post(uploadPetImage); // uploading pet image

module.exports = router;
