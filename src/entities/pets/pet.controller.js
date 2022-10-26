const createError = require("../../utils/errors/error.module");
const Pet = require("./pet.model");

const getOnePet = async (req, res) => {
  const pet = Pet.findOne({ _id: req.params.id });
  if (!pet) throw createError(404, "No Pets Found");
  res.status(200).json({ pet });
};

/// don't forget to add owner Id after impliminting the auth middleware
const addPet = async (req, res) => {
  const newPet = await Pet.create({ ...req.body });
  res.status(201).json({ newPet });
};

const uploadPetImage = async (req, res) => {
  const imageUrl = req.body.photoUrls;
  const pet = Pet.findOne({ _id: req.params.id });
  if (!pet) throw createError(404, "No pets Found");
  const photosArr = pet.photoUrls;
  photosArr.push(imageUrl);
  res.status(201).json({ petPhotos: photosArr });
};

const searchPet = async (req, res) => {
  const { tag, status } = req.query; // search by status and or tag

  // we made this empty obj in order not to mess with the query if a garbage params were sent
  const queryObj = {};

  if (status) queryObj.status = status;
  if (tag) queryObj.tag = tag;

  const pet = await Pet.find(queryObj);
  if (!pet) throw createError(404, "No pets Found");

  res.status(200).json({ pets: pet });
};

const updatePet = async (req, res) => {
  const pet = await Pet.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // new option to true to return the document after update was applied
    runValidators: true,
  });

  if (!pet) throw createError(404, "No pets Found");

  res.status(200).json({ pet });
};

const deletePet = async (req, res) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) throw createError(404, "No pets Found");

  res.status(200).json({ pet });
};

module.exports = {
  addPet,
  searchPet,
  updatePet,
  deletePet,
  getOnePet,
  uploadPetImage,
};
