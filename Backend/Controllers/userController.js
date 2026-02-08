import User from "../Models/user.js";

async function increaseFollowers(req, res) {
  let { userId } = req.user; //logged in user
  let { userid } = req.body; //user to be followed
  try {
    console.log(`userId: ${userId}`);
    console.log(`userid: ${userid}`);

    let user = await User.findById(userId);
    let userToBeFollowed = await User.findById(userid);

    if (!user || !userToBeFollowed) {
      return res.status(404).json({ msg: "User not found" });
    }

    // prevent duplicate follow
    if (user.following.includes(userid)) {
      return res.status(400).json({ msg: "Already following" });
    }

    userToBeFollowed.followers.push(user._id);
    userToBeFollowed.followersCount += 1;

    user.following.push(userToBeFollowed._id);
    user.followingCount += 1;

    await userToBeFollowed.save();
    await user.save();

    return res.json({ msg: "Followed successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
}

async function isFollowing(req, res) {
  try {
    let { userId } = req.user;
    let { userid } = req.query;

    let userToCheck = await User.findById(userid);

    if (!userToCheck) {
      return res.status(404).json({ msg: "user not found" });
    }

    let following = userToCheck.followers.includes(userId);

    return res.json({
      following,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function decreaseFollowers(req, res) {
  try {
    let { userId } = req.user;
    let { userid } = req.body;

    let user = await User.findById(userId);
    let userToUnfollow = await User.findById(userid);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (userId !== userid) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== userId,
      );
      userToUnfollow.followersCount -= 1;

      user.following = user.following.filter((id) => id.toString() !== userid);
      user.followingCount -= 1;

      await userToUnfollow.save();
      await user.save();
    } else if (userId == userid) {
      user.followers = user.followers.filter((id) => id.toString() !== userId);
      user.followersCount -= 1;

      user.following = user.following.filter((id) => id.toString() !== userid);
      user.followingCount -= 1;

      await user.save();
    }
    return res.json({ msg: "Unfollowed successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function findUser(req, res) {
  try {
    let { username } = req.query;
    console.log(username);
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.json({ msg: "user not found" });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

export { increaseFollowers, decreaseFollowers, isFollowing, findUser };
