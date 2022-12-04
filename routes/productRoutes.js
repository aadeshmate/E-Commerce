const { application } = require('express');
const express = require ('express');
const { findByIdAndUpdate } = require('../models/product');
const Product = require('../models/product');
const router = express.Router();
const product=require('../models/product')
const Review = require('../models/reviews')
const {isLoggedIn} = require('../middleware')



//to get all products
router.get('/products',async(req,res)=>{

    const products=await Product.find({});


    res.render('index',{products,message:req.flash('success')})
})

//get the form a new product

router.get('/product/new',isLoggedIn,(req,res)=>{

    res.render('products/new');
})

//create a new product

router.post('/products',isLoggedIn,async(req,res)=>{
    const newProduct = req.body;

    await Product.create(newProduct);
    // console.log(newProduct);
    req.flash('success','Product Created Successfully');

    res.redirect('/products')
})


//show a particular products

router.get('/products/:id',async(req,res)=>{

    const {id}= req.params;

    const product=await Product.findById(id).populate('reviews');

    // console.log(product);

    res.render('products/show',{product,message:req.flash('success')});
})

//Edit a particular product
router.get('/products/:id/edit',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    
    const product=await Product.findById(id);

    res.render('products/edit',{product});
})

//updating a particular product new id
router.patch('/products/:id',isLoggedIn,async(req,res)=>{

    const {id}= req.params;

    await Product.findByIdAndUpdate(id,req.body);

    req.flash('success','updated your product succesfully');

    res.redirect(`/products/${id}`);
})

//delete a particular product
router.delete('/products/:id',isLoggedIn,async(req,res)=>{

    const {id}=req.params;

    await Product.findByIdAndDelete(id);

    res.redirect('/products');


})

router.post('/products/:id/review',isLoggedIn, async(req,res)=>{
   
    //This is product on which u want ro create review
    const {id}=req.params;

    const {rating,comment} =req.body;

    const review=new Review({rating:rating,comment:comment,user:req.user.username});

    const product = await Product.findById(id);

    product.reviews.push(review);

     //saving a reviw in review collection
    await review.save();

    //saving a product after addding review to reviews array
    await product.save();

    req.flash('success','Thank u,You have successfullt created your review')
    res.redirect(`/products/${id}`);

})
//delete a review

router.delete('/products/:productid/review/:reviewid',isLoggedIn, async(req,res)=>{
    
    const {productid,reviewid}=req.params;

    await Product.findByIdAndUpdate(productid,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/products/${productid}`);



    
})


module.exports=router;