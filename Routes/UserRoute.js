const router = require("express").Router();
const { Router } = require("express");
const user = require("../Modal/UserModal");
const Joi = require("joi");
const User = require("../Modal/UserModal");
const jwtAuth = require("../Middleware/Jwt");
const jwt = require("jsonwebtoken");

//Endpoint to get a user by Id
router.route("/:id").get(jwtAuth, (req, res) => {
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
router.route("/").get(jwtAuth, (req, res) => {
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
  //Joi schema created for incoming post object
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    password: Joi.string().alphanum().required(),
    phone: Joi.number().integer(),
    age: Joi.number().max(100),
  });

  //validate the object recevied during post request
  const validation = schema.validate(req.body);

  //If Object is validated when recevied during post request
  if (validation.error) {
    res.send(validation.error.message);
  } else {
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
  }
});

//Endpoint to delete a new user
router.route("/delete/:id").delete(jwtAuth, (req, res) => {
  user
    .findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json("User not Find with ID:" + user);
      }
      res.json("User deleted successfully with id:" + req.params.id);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//Endpoint to update a new user

router.route("/update/:id").put(jwtAuth, (req, res) => {
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
  if (validation.error) {
    res.send(validation.error.message);
  } else {
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
  }
});

router.route("/validuser").post((req, res) => {
  const validCredential = {
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne(validCredential)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: "login not successful",
          error: "User not found",
        });
      } else {
        //Assigning jwt token
        const accessToken = jwt.sign(
          { email: req.body.email },
          process.env.auth_key_secret,
          { expiresIn: "30m" }
        );

        //Sending response
        res.status(200).json({
          message: "Login successful",
          accessToken: accessToken,
        });
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
