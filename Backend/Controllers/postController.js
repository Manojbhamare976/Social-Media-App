import Post from "../Models/post.js";
import User from "../Models/user.js";
import cloudinary from "../config/cloudinary.js";

async function createPost(req, res) {
  try {
    let { userId } = req.user;
    let { caption } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json("Please upload image or video");
    }

    const content = req.files.map((file) => file.path);
    const publicId = req.files.map((file) => file.filename);
    const resourceType = req.files.map((file) =>
      file.mimetype.startsWith("video") ? "video" : "image",
    );

    let post = new Post({
      user: userId,
      caption: caption,
      content: content, // only URLs
      publicId: publicId, //public id
      resourceType: resourceType,
    });

    await post.save();

    user.createdPosts.push(post._id);
    user.createdPostsCount += 1;

    await user.save();

    console.log("post saved successfully");
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json("Post creation failed");
  }
}

async function deletePost(req, res) {
  try {
    let { userId } = req.user;
    let { postId } = req.params;

    let user = await User.findById(userId);
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ msg: "you cannot delete this post" });
    }

    let publicId = post.publicId[0];
    console.log(publicId);
    let resourceType = post.resourceType[0];
    console.log(resourceType);

    await cloudinary.uploader
      .destroy(publicId, {
        resource_type: resourceType,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    user.createdPosts = user.createdPosts.filter(
      (id) => id.toString() !== postId,
    );

    await user.save();
    await post.deleteOne({});
    return res.status(200).json("Post deleted successfully");
  } catch (err) {
    return res.json({ msg: err.message });
  }
}

async function getPost(req, res) {
  try {
    let post = await Post.find({}).populate({
      path: "user",
      select: "username profilePic",
    });

    res.json(post);
  } catch (err) {
    console.log(err.message);
  }
}

export { createPost, deletePost, getPost };
