const mongoose = require("mongoose");

const FarmerProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    // Step 1 - Basic Info
    farmerName: String,
    farmName: String,
    village: String,
    district: String,
    state: String,
    mobile: String,
    whatsapp: String,
    experience: Number,
    farmSize: String,

    // Step 2 - Story
    story: String,

    // Step 3 - Gallery
    gallery: [String],

    // Step 4 - Products
    products: [
      {
        name: String,
        category: String,
        price: Number,
        unit: String
      }
    ],

    // Step 5 - Certifications
    certificates: [String],

    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FarmerProfile", FarmerProfileSchema);
