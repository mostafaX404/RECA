const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  uploadUserImage,
  resizeUserImage,
  getSellerProducts
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);


router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
router
  .route('/profileImage')
  .post(uploadUserImage, resizeUserImage, (req, res) => {
    res.status(200).json({ profileImg: req.body.profileImg });
  });

router.get('/myProducts', authService.allowedTo('seller'), getSellerProducts);



// Admin
router.use(authService.allowedTo('admin'));
router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route('/')
  .get(getUsers)
  .post(createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);


module.exports = router;
