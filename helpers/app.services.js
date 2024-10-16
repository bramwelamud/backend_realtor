// app.services.js
var jwt = require("jwt-simple");
var moment = require("moment");
const dotenv = require('dotenv').config();
const token_secret = process.env.TOKEN_SECRET || "laD@i-dLad-thisAGLGenToken-UniqueteComposeDecret";

exports.createToken = function (userId) {
  var payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment().add(60, "days").unix(),
  };
  return jwt.encode(payload, token_secret);
};