require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

var bodyParser = require('body-parser');
const User = require("./models/User");

/**
 * Controllers (route handlers).
 */
const movieController = require("./controllers/movie");
const userController = require("./controllers/user");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

/**
 * Session stuff
 */

const expressSession = require("express-session");
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

/**
 * Routes
 */

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/movieList", authMiddleware, movieController.read);
app.get("/movieList/delete/:id", authMiddleware, movieController.delete);
app.get("/movieList/update/:id", authMiddleware, movieController.edit);
app.post("/movieList/update/:id", authMiddleware, movieController.update);

app.get("/updateMovie/:id", authMiddleware, movieController.edit);

app.get("/addMovie", authMiddleware, (req, res) => {
  res.render("addMovie", {errors: {}});
});
app.post("/addMovie", authMiddleware, movieController.create);

app.get("/join", (req, res) => {
  res.render("newUser", {errors: {}});
});

app.post("/join", userController.create);
app.get("/login", (req, res) => {
  res.render('loginPage', {errors: {}})
});
app.post("/login", userController.login);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})


const PORT = process.env.WEB_PORT || process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
