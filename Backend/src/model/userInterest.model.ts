import mongoose from "mongoose";

const userInterestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    categories: [
      {
        name: String,
        score: {
          type: Number,
          default: 0
        }
      }
    ],

    tags: [
      {
        name: String,
        score: {
          type: Number,
          default: 0
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const UserInterestModel = mongoose.model(
  "UserInterest",
  userInterestSchema
);

export default UserInterestModel;