const jwt = require("jsonwebtoken");
const err = require("../errors/error.module");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw err(401, "No Token Provided");

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decode.userId,
      username: decode.username,
      userType: decode.userType,
    };

    next();
  } catch (error) {
    throw err(401, "No Token Provided");
  }
};
