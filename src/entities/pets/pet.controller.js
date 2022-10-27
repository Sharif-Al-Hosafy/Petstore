const createError = require("../../utils/errors/error.module");
const Pet = require("./pet.model");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const getOnePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No Pets Found");
  res.status(200).json({ pet });
};

/// don't forget to add owner Id after impliminting the auth middleware
const addPet = async (req, res) => {
  const newPet = await Pet.create({ ...req.body });
  res.status(201).json({ newPet });
};

const uploadPetImage = async (req, res) => {
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
  searchByStatus,
  updatePet,
  deletePet,
  getOnePet,
  uploadPetImage,
  searchByTag,
};
