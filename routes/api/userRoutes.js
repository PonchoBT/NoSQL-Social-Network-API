const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserId,
  deleteUserId,
  createFriend,
  deleteFriend
} = require('../../controllers/userController');

router.route('/')
.get(getUsers)
.post(createUser);

router.route('/:userId')
.get(getUser)
.put(updateUserId)
.delete(deleteUserId);

router.route('/:userId/friends/:friendId').post(createFriend);
router.route('/:userId/friends/:friendId').delete(deleteFriend);

module.exports = router;