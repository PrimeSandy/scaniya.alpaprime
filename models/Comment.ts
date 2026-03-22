import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  qrId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema(
  {
    qrId: { type: Schema.Types.ObjectId, ref: "QRCode", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
