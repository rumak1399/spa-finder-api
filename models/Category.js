import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  root: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model("Category", CategorySchema);
