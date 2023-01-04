const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

exports.getUserByEmail = (req, res, next) => {
    User.findOne({ "email": req.body.email }, (err, data) => {
        if(err || data == null){
            res.redirect('auth/login');
            return;
        }

        bcrypt.compare(req.body.password, data.password, (err, result) =>{
            if(result){
                res.user = data;
                next();
            }else{
                res.redirect('/auth/login')
                return;
            }
        });


    })
}

exports.getProfile = (req, res, next) => {
    User.findById(req.session.user._id, (err, data) => {
        data.populate('blogs', (err, data) => {
            res.profile = data;
            next();
        })
    })
}

exports.createUser = (req, res, next) => {
    if (req.body.firstName == "" || req.body.lastName == "" || req.body.username == ""
        || req.body.email == "" || req.body.password == "" ||
        req.body.passwordConfirmation == "" || req.file == null) {
        res.redirect('/auth/signup');
        return;
    } else if (req.body.password !== req.body.passwordConfirmation) {
        res.redirect('/auth/signup');
        return;
    }

    const fileName = req.body.firstName + req.body.lastName;
    const fileext = path.extname(req.file.originalname).toLowerCase();
    const fullFileName = fileName + fileext;

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../static/images/${fullFileName}`);

    if (fileext === ".png" || fileext === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
            if (err) {
                return;
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        res.redirect('/auth/signup');
                        return;
                    }


                    User.create({
                        password: hash,
                        username: req.body.username,
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        image: fullFileName,
                        blogs: []
                    }, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/auth/signup');
                            return;
                        }
                        res.redirect('/auth/login');
                        next()
                    })
                });
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
