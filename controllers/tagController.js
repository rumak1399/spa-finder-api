import Post from "../models/Post.js";
import Tag from "../models/Tag.js";

export const addTag = async (req, res) => {
  try {
    const newTag = new Tag({ ...req.body });
    await newTag.save();
    // here add the logic to add this review in the post model
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $addToSet: { tags: newTag?._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json(newTag);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
