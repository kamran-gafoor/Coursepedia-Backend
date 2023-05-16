const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    course_id: { type: String, required: true },
  },
  { collection: "Tracker" }
);

const Tracker = mongoose.model("Tracker", TrackerSchema);

module.exports = Tracker;
