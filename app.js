const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const seedDB=require('./seed');
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/shopping-App')
    .then(()=>console.log("DB Connected"))
    .catch((err)=>{
        console.log("DB Not connected..");
        console.log(err.message)
    })


//seed the db with default products

// seedDB();


const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes')


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const sessionConfig = {
    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitailized:true,
}

app.use(session(sessionConfig));
app.use(flash());


// Initiliazing the passport and session to for storing the user info

app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;

    next();
})


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
    res.send("Home Page");
});


app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);

app.listen(3000,()=>{
    console.log('server started at port 3000');
})