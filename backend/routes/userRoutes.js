const express = require('express');
const { checkEmail, createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/checkEmail', checkEmail);
router.post('/register', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;