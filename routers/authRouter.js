const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const auth = require('../helpers/auth');
const upload = multer({ dest: './static/images' });
// GET login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/auth/profile')
    } else {
        res.render('login.ejs');
    }
});
// POST
router.post('/login', express.urlencoded({ extended: true }),
    userController.getUserByEmail, (req, res) => {
        let user = res.user;
        req.session.user = user;
        res.redirect('/auth/profile');
    });

// GET sign up page
router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/auth/profile');
    } else {
        res.render('userform.ejs');
    }
});

// POST to create a new user
router.post('/signup', express.urlencoded({ extended: true }),
    upload.single('image'), userController.createUser, (req, res) => {

    });

// GET profile
router.get('/profile', auth.autherize, userController.getProfile, (req, res) => {
    let profile = res.profile;
    res.render('profile.ejs', { profile });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
})
module.exports = router;