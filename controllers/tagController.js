import Post from "../models/Post.js";
import Tag from "../models/Tag.js";

export const addTag = async (req, res) => {
  try {
    const newTag = new Tag({ ...req.body });
    const isPostId = await Tag.find({ postId: req.body.postId });
    console.log(newTag, isPostId);
    if (isPostId.length === 0) {
      await newTag.save();
    }
    else{
    await Tag.findByIdAndUpdate(
      req.body.postId,
      {
        $addToSet: { tags: newTag?._id },
      },
      {
        new: true,
      }
    );    
    }
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
