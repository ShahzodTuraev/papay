const mongoose = require("mongoose");
const { order_status_enums } = require("../lib/config");
const Scheme = mongoose.Schema;
const followScheme = new mongoose.Schema(
  {
    follow_id: { type: Scheme.Types.ObjectId, required: true },
    subscriber_id: { type: Scheme.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
followScheme.index({ follow_id: 1, subscriber_id: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followScheme);
