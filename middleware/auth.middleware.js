module.exports = (req, res, next) => {
  // Temporary user (later JWT laga dena)
  req.user = {
    id: "demo-user-123"
  };
  next();
};
