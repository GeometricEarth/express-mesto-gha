const router = require('express').Router();

const { getAllUsers, getUserById, addUser } = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);

module.exports = router;
