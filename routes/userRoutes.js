// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profilepic = require('../middlewares/profilepicuploader');


router.post('/register', userController.Register);
router.post('/validateregister', userController.ValidateRegister);
router.post('/login', userController.Login);
router.post('/change-password', userController.ChangePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetpassword);
router.put('/profileupdate', profilepic.single('profilepic'), userController.profileUpdate);
router.post('/logout', userController.Logout);
router.post('/contact-form', userController.ContactForm);

module.exports = router;