const FarmerProfile = require("../models/FarmerProfile");

/* Save or Update Step */
exports.saveProfileStep = async (req, res) => {
  try {
    const { step, data } = req.body;
    const userId = req.user.id;

    let profile = await FarmerProfile.findOne({ userId });

    if (!profile) {
      profile = new FarmerProfile({ userId });
    }

    Object.assign(profile, data);

    if (step === 6) {
      profile.isCompleted = true;
    }

    await profile.save();

    res.json({
      success: true,
      message: "Profile step saved",
      profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Get Profile */
exports.getProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({
      userId: req.user.id
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
