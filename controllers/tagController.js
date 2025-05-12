import Post from "../models/Post.js";
import Tag from "../models/Tag.js";

export const addTag = async (req, res) => {
  try {
    const newTag = new Tag({ ...req.body });
    const isPostId = await Tag.find({ postId: req.body.postId });
    console.log(newTag, isPostId);
    if (isPostId.length === 0) {
      await newTag.save();
    } else {
      await Tag.findOneAndUpdate(
        { postId: req.body.postId },
        {
          $addToSet: { tags: { $each: req.body.tags } },
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
        $addToSet: { tags: { $each: req.body.tags } },
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

export const getUniqueTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, "tags");
    // console.log("allTags", allTags);

    const tagsFlat = allTags.flatMap((tag) => tag.tags);
    // con/sole.log("tagsFlat", tagsFlat);

    const uniqueTags = Array.from(new Set(tagsFlat));
    // console.log("uniqueTags", uniqueTags);

    res.status(200).json(uniqueTags);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
