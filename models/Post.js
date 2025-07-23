import { model, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    image: {
      url: String,
      alt: String,
    },
    video: {
      url: String,
      alt: String,
    },
    price: { type: Number },
    additionalPriceInfo: {
      type: String,
    },
    discount: { type: Boolean, required: false },
    discountAmount: { type: Number, required: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference the Category model
      required: false,
    },
    tags: [{ type: String }],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reference the Category model
      required: false,
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review", // Reference the Category model
        required: false,
      },
    ],
    popular: { type: Boolean, required: false },
    email: { type: String },
    phone: { type: String },
    state: {
      type: Schema.Types.ObjectId,
        ref: "State", // Reference the Category model
        required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
        ref: "City", // Reference the Category model
        required: true,
    },
    address: {
      type: String,
      required: true
    },
    // location: {
    //   lat: {
    //     type: Number,
    //     // required: true,
    //   },
    //   lng: {
    //     type: Number,
    //     // required: true,
    //   },
    // },
  },
  {
    timestamps: true,
  }
);

export default model("Post", PostSchema);
