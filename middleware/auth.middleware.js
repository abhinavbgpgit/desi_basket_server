// Middleware to protect routes
export const auth = (req, res, next) => {
  try {
    // Example: check for a token in headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // For demo purposes, we just attach a dummy user
    // Replace this with real JWT verification in production
    req.user = { id: "123", role: "farmer" }; 

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
