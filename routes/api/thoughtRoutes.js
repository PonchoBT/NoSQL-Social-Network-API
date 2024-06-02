const router = require('express').Router();
const {
  getThoughts,
  getThoughtsId,
  createThought,
  updateThoughtId,
  deleteThoughtId,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

router.route('/')
.get(getThoughts)
.post(createThought);

router.route('/:thoughtId')
.get(getThoughtsId)
.put(updateThoughtId)
.delete(deleteThoughtId);

router.route('/:thoughtId/reactions').post(createReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction)

module.exports = router;


