require("dotenv").config();
require("express-async-errors");
const path = require("path");

//create express app
const express = require("express");
const app = express();

// require db
const dbConnection = require("./src/config/dbConnection");

//require routes
const usersRoutes = require("./src/entities/users/user.router");
const petsRoutes = require("./src/entities/pets/pet.router");
const orderRoutes = require("./src/entities/order/order.router");

// custom middlewares
const notFound = require("./src/utils/errors/not.found");
const errorHandler = require("./src/utils/errors/custom.error.handler");

// express middlewares
app.use(express.static(__dirname + "/uploads"));
const cors = require("cors");
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("Hi from Petstore");
});
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/pet", petsRoutes);
app.use("/api/v1/store", orderRoutes);

//Error Handling
app.use(notFound);
app.use(errorHandler);

// listening to a server
const port = process.env.PORT || 5000; //running server
const start = async () => {
  try {
    await dbConnection(process.env.MONGO_URI);
    console.log("Database connected");
    app.listen(port, () => {
      console.log("listining on port " + port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
