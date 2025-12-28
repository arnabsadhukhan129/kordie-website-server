const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
  {
    subject : {
      type : String,
      default : ""
    },
    comment: {
      type: String,
      default: "",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CommentsLogModel = mongoose.model("comments_log", CommentsSchema);

module.exports = CommentsLogModel;
