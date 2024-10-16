var jwt = require("jwt-simple");
var moment = require("moment");
const dotenv = require('dotenv').config();
const token_secret = process.env.TOKEN_SECRET || "laD@i-dLad-thisAGLGenToken-UniqueteComposeDecret";

exports.ensureAuthenticated = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, token_secret);
  
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: "The token has expired" });
  }
  
  req.user = payload.sub;
  req.tokenUID = token;
  next();
};