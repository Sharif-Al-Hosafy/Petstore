const createError = require("../../utils/errors/error.module");
const Pet = require("./pet.model");
const formidable = require("formidable");
const User = require("../users/user.model");

const getOnePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No Pets Found");
  res.status(200).json({ pet });
};

const addPet = async (req, res) => {
  if (req.user.userType !== "owner")
    throw createError(400, "You Have to be an Owner to add pets");

  const { name, category, status, tags, quantity } = req.body;
  const newPet = await Pet.create({
    name,
    category,
    status,
    quantity,
    tags,
    ownerId: req.user.id, // the user who created this pet
  });

  //// adding pet to the user inventory //////////

  const user = await User.findById(req.user.id);
  user.pets.push(newPet); // ---> to the pets array
  await user.save();

  ////////////////////////////////////////////////

  res.status(201).json({ newPet });
};

const uploadPetImage = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No pets Found");

  if (pet.ownerId != req.user.id)
    throw createError(401, "You're not the pet owner");

  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on("fileBegin", function (name, file) {
    console.log(file);
    file.filepath = "./uploads/" + file.originalFilename;
  });

  form.on("file", function (name, file) {
    console.log("Uploaded " + file.originalFilename);
  });

  res.status(201).json({});
};

const searchByStatus = async (req, res) => {
  const { status } = req.query; // search by query params

  // we made this empty obj in order not to mess with the query if a garbage params were sent
  const queryObj = {};

  if (status) queryObj.status = status;

  const pet = await Pet.find(queryObj);

  if (!pet) throw createError(404, "No pets Found");

  res.status(200).json({ pets: pet, nbhits: pet.length });
};

const searchByTag = async (req, res) => {
  let { tags } = req.query; // search by query params

  tags = tags.split(","); // to make array of different tags to make search more accurate

  const pet = await Pet.find({ tags: { $all: tags } });
  if (pet.length === 0) throw createError(404, "No pets Found");

  res.status(200).json({ pets: pet, nbhits: pet.length });
};

const updatePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No pets Found");

  if (pet.ownerId != req.user.id)
    throw createError(401, "You're not the pet owner");

  const petToUpdate = await Pet.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true, // new option to true to return the document after update was applied
      runValidators: true,
    }
  );

  if (!pet) throw createError(404, "No pets Found");

  res.status(200).json({ petToUpdate });
};

const deletePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No pets Found");

  if (pet.ownerId != req.user.id)
    throw createError(401, "You're not the pet owner");

  const petToDelete = await Pet.findByIdAndDelete({ _id: req.params.id });

  res.status(200).json({ petToDelete });
};

const submitBid = async (req, res) => {
  const pet = await Pet.findById(req.params.petId);
  if (!pet) throw createError(404, "No pets Found");

  const { amount } = req.body;

  pet.bids.push({ bidder: req.user.username, amount });

  await pet.save();

  res.status(200).json(pet);
};

const getAllBids = async (req, res) => {
  const pet = await Pet.findById(req.params.petId);
  if (!pet) throw createError(404, "No pets Found");
  const bids = pet.bids;
  console.log(bids);
  res.status(200).json(bids);
};

module.exports = {
  addPet,
  searchByStatus,
  updatePet,
  deletePet,
  getOnePet,
  uploadPetImage,
  searchByTag,
  submitBid,
  getAllBids,
};
