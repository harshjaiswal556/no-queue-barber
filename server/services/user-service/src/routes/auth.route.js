const express = require('express');
const { loginUser, registerUser, logoutUser } = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', (req, res)=> {
    return res.send("Auth running")
})
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

module.exports = router;