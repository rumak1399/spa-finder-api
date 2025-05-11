import { model, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    // slug: { type: String, required: true, unique: true }, // Unique slug
    description: { type: String, required: false },
    specification: { type: String, required: false, default: "" },
    image: {
      url: String,
      alt: String,
    },
    video: {
      url: String,
      alt: String,
    },
    // brochure: {
    //   url: String,
    //   filename: String,
    // },
    price: { type: Number },
    discount: { type: Boolean, required: false },
    discountAmount: { type: Number, required: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference the Category model
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reference the Category model
      required: false,
    },
    review: [{
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference the Category model
      required: false,
    }],
    // featured: { type: Boolean, required: false },
    popular: { type: Boolean, required: false },
    // status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Post", PostSchema);
