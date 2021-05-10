require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();

app.use(cors());
app.use(express.json());

/**
 * GET Root Route
 */
app.get("/", (req, res) => {
  res.send(db.users);
});

/**
 * POST Sing in Route
 */
app.post("/signin", signin.handleSignin(db, bcrypt));

/**
 * POST Register Route
 */
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

/**
 * GET Profile[ID] Route
 */
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

/**
 * POST Profile[params] Route
 */
app.post("/profile/:id", (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

/**
 * PUT Image Route
 */
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

/**
 * POST Imageurl Route
 */
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
