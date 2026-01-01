// Dummy controller functions

export const saveProfileStep = (req, res) => {
  const data = req.body;
  res.json({
    message: "Profile step saved successfully",
    user: req.user,
    data,
  });
};

export const getProfile = (req, res) => {
  res.json({
    message: "Fetched profile successfully",
    user: req.user,
    profile: {
      name: "Demo User",
      role: req.user.role,
    },
  });
};
