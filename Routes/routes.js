const verifyToken = require('../middleware/verifyToken');
const express = require ('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createUser, verifyCode, loginUser, forgotPassword, resetPassword, getUser, deleteUser, getAllUsers, deleteAllUser, loginUserAPI, deleteUserAPI } = require('../Controllers/controller');

router.post('/add-user', upload.none(), createUser);
router.post('/verify-code', verifyCode);
router.post('/login-user', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/get-user', verifyToken, getUser);
router.delete('/delete-user', verifyToken, deleteUser);
router.get('/getall-users', verifyToken, getAllUsers);
router.delete('/deleteall-users', verifyToken, deleteAllUser);
// router.post('/insert-loginuser-data', verifyToken, loginUserAPI);
// router.delete('/delete-loginuser-data', verifyToken, deleteUserAPI);


module.exports = router;