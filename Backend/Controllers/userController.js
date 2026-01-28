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
  let { userId } = req.user;
  let { userid } = req.body;

  let user = User.findById(userId);
  let userToCheck = User.findById(userid);

  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  } else if (!userToCheck) {
    return res.status(404).json({ msg: "user not found" });
  }

  let follower = await userToCheck.followers.find((u) => u._id === user._id);

  if (!follower) {
    res.json({
      msg: `you are not following ${userToCheck.username}`,
    });
    return false;
  } else {
    return true;
  }
}

export { increaseFollowers, isFollowing };
