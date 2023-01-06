require('dotenv').config()
// import modules
const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const authRouter = require('./routers/authRouter');
const blogRouter = require('./routers/blogRouter');
const auth = require('./helpers/auth');

// create a new app
const app = express();
app.use(expressSession({
    secret: "topsecret",
    resave: false,
    saveUninitialized: true
}));
// start the server on port 80
app.listen(process.env.PORT, () => {
    console.log("Server started")
});

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

// connect to db with the name: blog02
mongoose.connect('mongodb+srv://Enedaa2:'+ process.env.DB_PASS + 'cluster0.yirgony.mongodb.net/blog02').then(
    () => {console.log("DB connected") },
    err => {console.log("DB not connected") }
);


// localhost/
app.use('/auth', authRouter);

// localhost/
app.use('/blogs', auth.autherize, blogRouter);

app.use('*', (req,res)=>{
    if(req,session.user){
      res.redirect('/blogs')
    }else{
        res.redirect('/auth/login')
    }
});

