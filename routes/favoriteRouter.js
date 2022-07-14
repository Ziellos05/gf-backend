const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
const cors = require("./cors");

const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._doc._id })
      .populate("user")
      .populate("dishes._id")
      .then(
        (favorite) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._doc._id })
      .then(
        (favorite) => {
          if (favorite == null) {
            console.log("No hay favorite, lo creo");
            Favorite.create({ user: req.user._doc._id })
              .then(
                (favorite) => {
                  for (var i = 0; i < req.body.length; i++) {
                    favorite.dishes.unshift({ _id: req.body[i]._id });
                  }
                  favorite.save().then(
                    () => {
                      Favorite.findOne({ user: req.user._doc._id })
                        .populate("user")
                        .populate("dishes._id")
                        .then(
                          (favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                          },
                          (err) => next(err)
                        )
                        .catch((err) => next(err));
                    },
                    (err) => next(err)
                  );
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else if (favorite != null) {
            console.log("hay favorito, no lo creo");
            for (var i = 0; i < req.body.length; i++) {
              favorite.dishes.unshift({ _id: req.body[i]._id });
            }
            favorite.save().then(
              () => {
                Favorite.findOne({ user: req.user._doc._id })
                  .populate("user")
                  .populate("dishes._id")
                  .then(
                    (favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            );
            (err) => next(err);
          } else {
            err = new Error("Petition denied");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove({ user: req.user._doc._id })
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._doc._id })
    .then((favorite) => {
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorite});
        }
        else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorite});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorite});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._doc._id })
      .then(
        (favorite) => {
          if (favorite == null) {
            console.log("No hay favorite, lo creo");
            Favorite.create({ user: req.user._doc._id })
              .then(
                (favorite) => {
                  favorite.dishes.unshift({ _id: req.params.dishId });
                  favorite.save().then(
                    () => {
                      Favorite.findOne({ user: req.user._doc._id })
                        .populate("user")
                        .populate("dishes._id")
                        .then(
                          (favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                          },
                          (err) => next(err)
                        )
                        .catch((err) => next(err));
                    },
                    (err) => next(err)
                  );
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else if (favorite != null) {
            console.log("hay favorito, no lo creo");
            favorite.dishes.unshift({ _id: req.params.dishId });
            favorite.save().then(
              () => {
                Favorite.findOne({ user: req.user._doc._id })
                  .populate("user")
                  .populate("dishes._id")
                  .then(
                    (favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            );
            (err) => next(err);
          } else {
            err = new Error("Petition denied");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes/" + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._doc._id })
      .then(
        (favorite) => {
          if (favorite != null && favorite.dishes.id(req.params.dishId) != null) {
            favorite.dishes.id(req.params.dishId).remove();
            favorite.save().then(
              (favorite) => {
                Favorite.findOne({ user: req.user._doc._id })
                  .populate("user")
                  .populate("dishes._id")
                  .then(
                    (favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            );
          } else if (favorite == null) {
            err = new Error("U have not favorite dishes");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("This dish was not found into your favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
