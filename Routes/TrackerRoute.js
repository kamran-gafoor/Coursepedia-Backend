const router = require("express").Router();
const { Router } = require("express");
const tracker = require("../Modal/CourseTrackerModal");
const Joi = require("joi");

//Endpoint to get all users
router.route("/").get((req, res) => {
  tracker
    .find()
    .then((resData) => {
      res.send(resData);
    })
    .catch((Error) => {
      res.send(Error);
    });
});

//Endpoint to Add a new user
router.route("/addtracker").post((req, res) => {
  //Joi schema created for incoming post object
  const schema = Joi.object({
    user_id: Joi.string().min(2).required(),
    course_id: Joi.string().min(2).required(),
  });

  //validate the object recevied during post request
  const validation = schema.validate(req.body);

  //If Object is validated when recevied during post request
  if (validation.error) {
    res.send(validation.error.message);
  } else {
    //Create a new user model to save it in database
    const newuser = new tracker({
      user_id: req.body.user_id,
      course_id: req.body.course_id,
    });

    //Passing the new object from user to mongoose to create a new entry
    newuser
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

//Endpoint to delete a new user
router.route("/delete/:id").delete((req, res) => {
  tracker
    .findByIdAndDelete(req.params.id)
    .then((tracker) => {
      if (!tracker) {
        return res.status(404).json("User not Find with ID:" + user);
      }
      res.json("User deleted successfully with id:" + req.params.id);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
