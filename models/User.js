import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  role: {
    type: String,
    enum: ["user", "provider", "admin"],
    default: "user",
  },
  isProvider: {
    type: Boolean,
    default: false,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model("User", UserSchema);
