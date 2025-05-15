const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided. Unauthorized" });
  }

  // Try verifying with Admin key
  jwt.verify(token, process.env.Admin_Key, (err, decoded) => {
    if (!err) {
      req.email = decoded.email;
      req.role = decoded.role;
      return next();
    }

    // If Admin key fails, try with User key
    jwt.verify(token, process.env.User_Key, (err, decoded) => {
      if (!err) {
        req.email = decoded.email;
        req.role = decoded.role;
        return next();
      }

      // Both verifications failed
      return res.status(401).json({ message: "Invalid token. Unauthorized" });
    });
  });
};

module.exports = verifyUser;
