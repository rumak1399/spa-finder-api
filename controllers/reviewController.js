import Post from "../models/Post.js";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const newReview = new Review({ ...req.body });
    await newReview.save();
    // here add the logic to add this review in the post model
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $addToSet: { review: newReview?._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json(newReview);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
