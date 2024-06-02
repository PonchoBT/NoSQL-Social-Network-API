const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v').populate('friends').populate('thoughts');
      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      } else {
        res.json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const dbUserData = await User.create({
        username: req.body.username,
        email: req.body.email
      });
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUserId(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          username: req.body.username,
          email: req.body.email
        },
        { new: true }
      );
      if (result) {
        console.log(`Updated: ${result}`);
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'No user with that ID' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async deleteUserId(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete({ _id: req.params.userId });
      if (!deletedUser) {
        return res.status(404).json({ message: 'No user found with that ID.' });
      }
      await Thought.deleteMany({ username: deletedUser.username });

      res.json({ message: 'User and associated thoughts deleted successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async createFriend(req, res) {
    try {
      const friend = await User.findOne({ _id: req.params.friendId }).select('_id');
      if (!friend) {
        return res.status(404).json({ message: 'No friend with that ID' });
      }
  
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friend._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
  
      res.json({ friend: friend._id });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const friendIndex = user.friends.indexOf(friendId);
      if (friendIndex === -1) {
        return res.status(400).json({ message: 'Friend not found in users friend list' });
      }

      user.friends.splice(friendIndex, 1);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};