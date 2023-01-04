const express = require('express');
const multer = require('multer');
const router = express.Router();
const blogController = require('../controllers/blogController');

const upload = multer({ dest: "./static/images" });
// localhost/blogs
// GET all blogs
router.get('/', blogController.getAllBlogs, (req, res) => {
    let blogs = res.blogs;
    res.render('blogs.ejs', { blogs });
});

// localhost/blogs/create
// GET to create a new blog
router.get('/create', (req, res) => {
    res.render('blogform.ejs');
});

// POST to create a new blog
router.post('/create', express.urlencoded({ extended: true }), upload.single('image'),
    blogController.createBlog, (req, res) => {
        console.log('new blog');
    });

// localhost/blogs/blogId
// GET blog by id
router.get('/:blogId', blogController.getBlogById, (req, res) => {
    let blog = res.blog;
    res.render('blog.ejs', { blog })
});

// localhost/blogs/user/:userId
// GET blogs by user Id
router.get('/user/:userId', blogController.getUserBlogs, (req, res) => {
    let profile = res.user;
    res.render('profile.ejs', { profile });
});

module.exports = router;