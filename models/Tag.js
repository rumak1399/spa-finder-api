import { model, Schema } from "mongoose";

const tagSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default model("Tag", tagSchema);
