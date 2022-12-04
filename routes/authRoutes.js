
const { application } = require('express');
const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user')




// router.get('/fakeuser',async(req,res)=>{
//     const user = new User({
//         username:'Aadesh',
//         email:'aadesh@gmail.com'
//     });

//     const newUser= await User.register(user,'1234');

//     res.send(newUser);
// });

router.get('/register',(req,res)=>{
    res.render('auth/signup')
})

//Create a new user in db
router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}= req.body;
        const user = new User({
        username,
        email
        })

        await User.register(user,password);

        req.flash('success',`Welcome ${username}, please login to continue`);
        res.redirect('/login')

    }
    catch(e){
        // console.log(e.message);
        req.flash('error',e.message)
        res.redirect('/register');

    }
})
// display login form to the user
router.get('/login', (req, res) => {
    res.render('auth/login');
});
//login the user into the session
router.post('/login',passport.authenticate('local',
    {
        failureRedirect : '/login',
        failureFlash:true
    }) ,
    (req,res)=>{
        // console.log(req.user);
        const {username} = req.user;
        req.flash('success',`Welcome back ,${username}`)
        res.redirect('/products');
    }
);

//logout the user from the session

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','logged out succesfully')
    res.redirect('/login');
})

module.exports = router;