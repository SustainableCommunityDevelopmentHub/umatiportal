const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Blog = require('../models/Blog');
const User = require('../models/User');
    
const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /account/blog
 * Blog manager.
 */
exports.getBlogupdated = function (req, res, user) {
    
            // Successful, so rendecalsr.
            res.render('account/blogupdated', { title: 'Blog updated'});
};

exports.getPublicBlog = function (req, res, user) {
    Blog.find()
        .exec(function (err, blog_data) {          
            // Successful, so rendecalsr.
            res.render('account/blogpublic', { title: 'Public Blog', blogs: blog_data });
        })
};

exports.getBlog = function (req, res, user) {
    Blog.find()
        .exec(function (err, blog_data) {          
            // Successful, so rendecalsr.
            res.render('account/blog', { title: 'Personal Blog', blogs: blog_data });
        })
};


/** 
exports.getBlog = (req, res) => {

  const blogs = Blog.list;
  res.render('account/blog', {
    title: 'Blog manager'
  });
};

 * POST /blog
 * Sign in using email and password.
 */
exports.postBlog = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.blogpost)) validationErrors.push({ msg: 'Blog post cannot be blank.' });
};


/*
 * POST /account/upload
 * Sign in using email and password.
 */
exports.postUpload = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.blogpost)) validationErrors.push({ msg: 'Blog post cannot be blank.' });
};




/**
 * GET /createpost
 * Signup page.
 */
exports.getCreatepost = (req, res) => {
  res.render('account/createpost', {
    title: 'Create post'
  });
};

/**
 * POST /createpost
 * Create a new local account.
 */
exports.postCreatepost = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.posttitle)) validationErrors.push({ msg: 'Please enter a title for your new post.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your post.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/blog');
  }

  const blog = new Blog({
    posttitle: req.body.posttitle,
    post: req.body.post, 
    username: req.body.user, 
    location: req.body.location, 
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate,
    template: req.body.template
  });

  Blog.findOne({ posttitle: req.body.posttitle }, (err, existingBlog) => {
    if (err) { return next(err); }
    if (existingBlog) {
      req.flash('errors', { msg: 'Blog post with that title already exists.' });
      return res.redirect('/account/blog');
    }
    blog.save((err) => {
      if (err) { return next(err); }
      res.redirect('/account/blog');
    });
  });
};


// display blog post
exports.getDisplayBlogpost = (req, res, next) => {
  Blog.findById(req.params.blogpost_id, function(err, blog) {
    if (blog.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/blogdisplay', {
      title: 'display blog entry',
      blogdata: blog
    });
  });
};
 



// get a blog post
exports.getUpdateBlogpost = (req, res, next) => {
  Blog.findById(req.params.blogpost_id, function(err, blog) {
    if (blog.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/blogedit', {
      title: 'Edit blog entry',
      blogdata: blog
    });
  });
};
 


exports.postUpdateBlogpost = (req, res, next) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  let id = req.params.blogpost_id;
  var data = {
    user : req.body.user,
    username : req.body.user,
    posttitle : req.body.posttitle,
    authorname : req.body.authorname,
    post : req.body.post,
    location : req.body.location,
    postcat : req.body.postcat,
    posttags : req.body.posttags,
    postdate : req.body.postdate,
    sharedwith : req.body.sharedwith
  }
 
  // save the user
  Blog.findByIdAndUpdate(id, data, function(err, blogpost) {
  if (err) throw err;
 
  res.send('Successfully! Blog updated - '+blogpost.name);
  });
};


exports.postUpdateBlog = (req, res) => {
  // update podcast ( Elevator ) and send back all calendar entries after update
  // create mongoose method to update a existing record into collection


  var blogid = req.body.blogpost_id;
  var data = {
    user : req.body.user,
    username : req.body.username,
    posttitle : req.body.posttitle,
    authorname : req.body.authorname,
    post : req.body.post,
    location : req.body.location,
    postcat : req.body.postcat,
    posttags : req.body.posttags,
    postdate : req.body.postdate,
    iphash : req.body.iphash,
    transhash : req.body.transhash,
    group : req.body.group,
    visibility: req.body.visibility
  }

  // save the update
  Blog.findByIdAndUpdate(blogid, data, function(err, pos) {
  if (err) throw err;

  req.flash('success', { msg: 'Your blog post has been updated.' });
  res.redirect('/account/blog');
  });
};
