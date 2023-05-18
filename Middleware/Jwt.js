const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  //Get the authorization token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  //Check if the token from the header matches the Secrete token
  jwt.verify(token, process.env.auth_key_secret, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.email;
    next();
  });
};

module.exports = jwtAuth;
