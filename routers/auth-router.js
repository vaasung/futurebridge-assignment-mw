const { Router } = require('express');
const {
  login,
  register,
  updateUser,
  deleteUser,
  viewUser,
} = require('./../controllers/auth-controller');
const router = Router();

router.post('/login', login);
router.post('/register', register);
router.patch('/update', updateUser);
router.delete('/delete', deleteUser);
router.get('/view', viewUser);

module.exports = router;
