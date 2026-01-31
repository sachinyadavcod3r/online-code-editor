const jwt = require("jsonwebtoken");

function protectPage(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, "supersecretkey");
    next(); // token is valid → proceed
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

module.exports = protectPage;
