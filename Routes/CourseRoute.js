const router = require("express").Router();
const { Router } = require("express");
const course = require("../Modal/CourseModal");
const Joi = require("joi");

//Endpoint to get all users
router.route("/").get((req, res) => {
  course
    .find()
    .then((resData) => {
      res.send(resData);
    })
    .catch((Error) => {
      res.send(Error);
    });
});

//Endpoint to Add a new user
router.route("/addcourse").post((req, res) => {
  //Joi schema created for incoming post object
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string(),
    video: Joi.string(),
    link: Joi.string(),
    difficulty: Joi.string(),
    type: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
  });

  //validate the object recevied during post request
  const validation = schema.validate(req.body);

  //If Object is validated when recevied during post request
  if (validation.error) {
    res.send(validation.error.message);
  } else {
    //Create a new user model to save it in database
    const newcourse = new course({
      name: req.body.name,
      description: req.body.description,
      video: req.body.video,
      link: req.body.link,
      difficulty: req.body.difficulty,
      type: req.body.type,
      category: req.body.category,
    });

    //Passing the new object from user to mongoose to create a new entry
    newcourse
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

module.exports = router;
