const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getThoughtsId(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with the requested ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const { thoughtText, username } = req.body;

      if (!thoughtText) {
        return res.status(400).json({ error: "Thought text is required." });
      }

      const newThought = await Thought.create({ thoughtText, username });

      res.status(201).json(newThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async updateThoughtId(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async deleteThoughtId(req, res) {
    try {
      const deleteThought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!deleteThought) {
        return res.status(404).json({ message: 'No thought found with the requested Id' });
      }
      const user = await User.findById(deleteThought.userId);
      if (user) {
        user.thoughts.pull(deleteThought._id);
        await user.save();
      }

      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;
      const { thoughtId } = req.params;
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      thought.reactions.push({ reactionBody, username });
      await thought.save();

      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
        const { thoughtId, reactionId } = req.params;

        // Find the thought by 'thoughtId'
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Find the index of the reaction with the given reactionId in the thought's reactions array
        const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === reactionId);
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        // Remove the reaction from the thought's reactions array
        thought.reactions.splice(reactionIndex, 1);
        await thought.save();

        res.json({ message: 'Reaction deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
}
};