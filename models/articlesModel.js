const mongoose = require("mongoose");

const articlesSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Education", "Businessmen", "Positions"],
    },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

articlesSchema.index({ Title: 'text', description: 'text', category: 'text', slug: 'text' });

const Articles = mongoose.model("Articles", articlesSchema);

module.exports = Articles;
