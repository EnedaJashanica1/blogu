const Blog = require('../models/blog');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

exports.getAllBlogs = (req, res, next) => {
    Blog.find({}).populate('author').exec((err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.blogs = data;
        next();
    });
}
// localhost/blogs/kdjsajlds4f6ss6
exports.getBlogById = (req, res, next) => {
    Blog.findById(req.params.blogId, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        data.populate('author', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            res.blog = data;
            next()
        })
    })
}

exports.createBlog = (req, res, next) => {
    if (req.body.title == "" || req.body.text == "" || req.file == null) {
        res.redirect('/blogs/create')
        return;
    }
    // "dita e pare e veres"  => "ditaepareeveres"
    const fileName = req.body.title.replace(" ", "")
    // .png .jpg .PNG
    const fileext = path.extname(req.file.originalname).toLowerCase();
    // "ditaepareeveres.png"
    const fullFileName = fileName + fileext;

    const tempPath = req.file.path;
    // C:\Users\Dell\Desktop\Blog_G2\static\images\ditaepareeveres.png
    const targetPath = path.join(__dirname, `../static/images/${fullFileName}`);

    if (fileext === ".png" || fileext === ".jpg" || fileext === ".jpeg") {
        fs.rename(tempPath, targetPath, err => {
            if (err) {
                return;
            } else {
                Blog.create({
                    title: req.body.title,
                    text: req.body.text,
                    date: new Date(),
                    image: fullFileName,
                    author: req.session.user._id
                }, (err, data) => {
                    User.updateOne({ _id: req.session.user._id },
                        { $push: { blogs: data } }, (err, data) => {
                            res.redirect('/auth/profile')
                            next()
                        })
                })
            }
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err)
                return;
            res.send("Only .png or .jpg files are allowed!")
        });
    }


}

exports.getUserBlogs = (req, res, next) => {
    User.findById(req.params.userId, (err, data) => {
        data.populate('blogs', (err, data) => {
            res.user = data;
            next();
        })
    });
}