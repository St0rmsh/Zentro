import mongoose from "mongoose";

export interface IReadingProgress extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  maxPercentage: number;
  timeSpentSeconds: number;
  firstReadAt: Date;
  lastReadAt: Date;
  completedAt?: Date;
}

const readingProgressSchema = new mongoose.Schema<IReadingProgress>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    maxPercentage: { type: Number, default: 0, min: 0, max: 100 },
    timeSpentSeconds: { type: Number, default: 0, min: 0 },
    firstReadAt: { type: Date, required: true },
    lastReadAt: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

readingProgressSchema.index({ user: 1, post: 1 }, { unique: true });
readingProgressSchema.index({ user: 1, lastReadAt: -1 });
readingProgressSchema.index({ user: 1, completedAt: -1 });

const ReadingProgressModel = mongoose.model<IReadingProgress>("ReadingProgress", readingProgressSchema);

export default ReadingProgressModel;