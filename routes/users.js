const express = require('express');
const usersRouter = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//Register
usersRouter.post('/register',(req,res,next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err,user) => {
        "use strict";
        if(err){
            res.json({success: false, msg: 'Failed to register user'})
        }
        else {
            res.json({success: true, msg: 'User is registered'});
        }
    });
});

//Authenticate
usersRouter.post('/authenticate',(req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUserName(username,(err, user) => {
        "use strict";
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({user: user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user:{
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else{
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });
    })

});

//Profile
usersRouter.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {

    res.json({user: req.user});
});

module.exports = usersRouter;