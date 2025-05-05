import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
  },
  userEmail: {
    type: String,
  },
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true
});

export default model("Review", reviewSchema);
