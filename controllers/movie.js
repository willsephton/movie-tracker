const Movie = require("../models/Movie");

exports.list = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render("movieList", { movies: movies });
  } catch (e) {
    res.status(404).send({ message: "could not list movies" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Movie.findByIdAndRemove(id);
    res.redirect("/movieList");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};