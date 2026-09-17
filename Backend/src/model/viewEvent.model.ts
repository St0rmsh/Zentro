import mongoose from "mongoose";

export interface IViewEvent {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    durationMs: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const viewEventSchema = new mongoose.Schema<IViewEvent>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true
        },
        durationMs: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    { timestamps: true }
);

viewEventSchema.index({ user: 1, post: 1 });
viewEventSchema.index({ post: 1, createdAt: -1 });

const ViewEventModel = mongoose.model("ViewEvent", viewEventSchema);

export default ViewEventModel;
