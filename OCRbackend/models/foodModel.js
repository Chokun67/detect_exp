import mongoose from "mongoose";

const foodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    exp: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Food = mongoose.model("foods", foodSchema);
