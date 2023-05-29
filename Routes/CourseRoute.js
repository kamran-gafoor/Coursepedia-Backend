const router = require("express").Router();
const { Router } = require("express");
const course = require("../Modal/CourseModal");
const Joi = require("joi");

//Endpoint to get all course
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

//Endpoint to Add a new course
router.route("/addcourse").post((req, res) => {
  //Joi schema created for incoming post object
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string(),
    video: Joi.string(),
    link: Joi.string(),
    difficulty: Joi.number(),
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

//Endpoint to delete a new course
router.route("/delete/:id").delete((req, res) => {
  course
    .findByIdAndDelete(req.params.id)
    .then((course) => {
      if (!course) {
        return res.status(404).json("User not Find with ID:" + course);
      }
      res.json("Course deleted successfully with id:" + req.params.id);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.route("/update/:id").put((req, res) => {
  //Joi schema created for incoming post object
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string(),
    video: Joi.string(),
    link: Joi.string(),
    difficulty: Joi.number(),
    type: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
  });
  //validate the object recevied during post request

  const validation = schema.validate(req.body);
  if (validation.error) {
    res.send(validation.error.message);
  } else {
    course
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((course) => {
        if (!course) {
          return res.status(404).json("course updated with ID:" + course);
        }
        res.send(course);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
});

//Endpoint to get a course by name
router.route("/:id").get((req, res) => {
  course
    .findById(req.params.id)
    .then((resData) => {
      //If there is no course found
      if (resData) {
        res.json(resData);
      } else {
        res.json("Course not Found with :" + req.params.id);
      }
    })
    .catch((Error) => {
      res.send(Error);
    });
});

module.exports = router;
