import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  readAt?: Date;
}

const messageSchema = new mongoose.Schema<MessageDocument>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 5000 },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ["image", "video"] },
  readAt: { type: Date },
}, { timestamps: true });

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, readAt: 1 });

export default mongoose.model<MessageDocument>("Message", messageSchema);
