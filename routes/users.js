const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  addUser,
  updateUserProfile,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', updateUserProfile);

module.exports = router;
