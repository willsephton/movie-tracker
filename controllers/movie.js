const Movie = require("../models/Movie");

exports.read = async (req, res) => {
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

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findById(id);
    res.render('updateMovie', { movie: movie, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find movie ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movie.updateOne({ _id: id }, req.body);
    res.redirect('/movieList/?message=Movie has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find movie ${id}.`,
    });
  }
};

exports.create = async (req, res) => {

  try {
    const movie = new Movie({ name: req.body.name, synopsis: req.body.synopsis, review: req.body.review, watched: req.body.watched });
    await movie.save();
    res.redirect('/movieList/?message=Movie has been added')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('addMovie', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}