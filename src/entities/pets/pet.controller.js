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

  form.on("fileBegin", async function (name, file) {
    file.filepath = "./uploads/" + file.originalFilename;
    pet.photoUrls.push(`http://localhost:5000/${file.originalFilename}`);
    await pet.save();
  });

  form.on("file", function (name, file) {
    console.log("Uploaded " + file.originalFilename);
  });

  res.status(201).json({ message: "Uploaded successfully" });
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

  if (!tags) throw createError(404, "No Tags added in query params");

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

/////////////////////// Challenge 1 ///////////////////////////////
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
  let bids = pet.bids;
  bids = bids.sort((a, b) => b.amount - a.amount); // getting prices from high to low
  res.status(200).json(bids);
};
//////////////////////////////////////////////////////////////////////

/////////////////////////// challenge 2 /////////////////////////////
const auction = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw createError(404, "No pets Found");
  let bids = pet.bids.sort((a, b) => b.amount - a.amount); // getting prices from high to low

  let auctionResults = [];
  if (bids.length > pet.quantity) {
    // bidders more than the quantity in stock so the last bidder is the loser
    for (let i = 0; i < pet.quantity; i++) {
      let auc = {};
      auc.name = bids[i].bidder;
      auc.amount = bids[i + 1].amount;
      auctionResults.push(auc);
    }

    let loser = {
      name: bids[bids.length - 1].bidder,
      amount: "Lost in the auction",
    };
    auctionResults.push(loser);
  } else if (bids.length == pet.quantity) {
    // bidders are qual to the quantity
    for (let i = 0; i < pet.quantity - 1; i++) {
      let auc = {};
      auc.name = bids[i].bidder;
      auc.amount = bids[i + 1].amount;
      auctionResults.push(auc);
    }

    let loser = {
      name: bids[bids.length - 1].bidder,
      amount: "Lost in the auction",
    };
    auctionResults.push(loser);
  } else if (bids.length < pet.quantity)
    throw createError(404, "No Bids No Winners");

  // if two bids are equal take the first one --> note: no 2 user names will be equal accourding to the db model
  if (auctionResults[0].amount == auctionResults[1].amount) {
    let winner =
      auctionResults[0].name < auctionResults[1].name
        ? auctionResults[0].name
        : auctionResults[1].name;

    return res
      .status(200)
      .json({ message: `The winner is ${winner} According to the equality ` });
  }

  res.status(200).json(auctionResults);
};

/////////////////////////////////////////////////////////////////////

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
  auction,
};
