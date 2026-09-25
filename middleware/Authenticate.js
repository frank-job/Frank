const isAuthenticated = (req, res, next) => {
  if (req.user === undefined) {
    return res.status(401).json("You do not have access.");
  }
  next();
};

module.exports = {
  isAuthenticated
};