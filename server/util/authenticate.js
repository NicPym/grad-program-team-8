const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.redirect("/login");
  }

  const token = authHeader.split(/\s/g)[1];
  let decodedToken = "";
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    return res.redirect("/login");
  }

  if (!decodedToken) {
    return res.redirect("/login");
  } else {
    req.token = decodedToken;
    next();
  }
};
