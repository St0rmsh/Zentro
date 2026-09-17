import mongoose from "mongoose";

export interface IReadingActivity extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD, UTC
  minutesSpent: number;
  completedPostIds: mongoose.Types.ObjectId[];
}

const readingActivitySchema = new mongoose.Schema<IReadingActivity>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    minutesSpent: { type: Number, default: 0, min: 0 },
    completedPostIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

readingActivitySchema.index({ user: 1, date: 1 }, { unique: true });

const ReadingActivityModel = mongoose.model<IReadingActivity>("ReadingActivity", readingActivitySchema);

export default ReadingActivityModel;