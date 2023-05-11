const router = require("express").Router();
const user = require("../Modal/UserModal");

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

module.exports = router;
