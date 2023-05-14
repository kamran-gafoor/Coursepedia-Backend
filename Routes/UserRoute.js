const router = require("express").Router();
const { Router } = require("express");
const user = require("../Modal/UserModal");
const Joi = require("joi");

//Endpoint to get a user by Id
router.route("/:id").get((req, res) => {
  user
    .findById(req.params.id)
    .then((resData) => {
      //If there is no user found
      if (resData) {
        res.json(resData);
      } else {
        res.json("User not Found with :" + req.params.id);
      }
    })
    .catch((Error) => {
      res.send(Error);
    });
});

//Endpoint to get all users
router.route("/").get((req, res) => {
  user
    .find()
    .then((resData) => {
      res.send(resData);
    })
    .catch((Error) => {
      res.send(Error);
    });
});

//Endpoint to Add a new user
router.route("/adduser").post((req, res) => {
  //Create a new user model to save it in database
  const newuser = new user({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
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
});

//Endpoint to update a new user

router.route("/update/:id").put((req, res) => {
  //Joi schema created for incoming post object
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    password: Joi.string().alphanum().required(),
    phone: Joi.number().integer(),
    age: Joi.number().integer().max(100),
  });

  //validate the object recevied during post request

  const validation = schema.validate(req.body);
  console.log(validation.error);
  if (validation.error) {
    user
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json("User updated with ID:" + user);
        }
        res.send(user);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.send("Invalid data");
  }
});

module.exports = router;
