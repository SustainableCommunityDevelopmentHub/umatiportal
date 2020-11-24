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
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();


const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /account/blog
 * 
 */
exports.getBlogupdated = function (req, res, user) {
    
            // Successful, so rendecalsr.
            res.render('account/blogupdated', { title: 'Blog updated'});
};


// display blog index page with list
exports.getDisplayPublicBlog = (req, res, user) => {

  let blogname = req.params.name
  let blognameuc = req.params.name.toUpperCase()
//  if (blogname !== 'undefined')
  User.find( { blogname: blogname } , function(err, user){
    if (err) { return next(err); }
  });



  Blog.find( { username: blogname } , function(err, blog) {  

    return res.render('account/blogdisplay', {
      title: 'Public blog',
      blogs: blog,
      blogname: blogname,
      blognameuc: blognameuc,
      thisuser: user
    });
  });
};
 
// display individual page
exports.getDisplayPublicBlogPage = (req, res, next) => {

  let posttitle = req.params.posttitle
  let blogname = req.params.name
  let blognameuc = req.params.name.toUpperCase()
  Blog.find( {posttitle: posttitle } , function(err, blog) {  

	    
    console.log( entities.decode( blog.post )); 
    var postmodded = entities.decode( blog.post ); 
    console.log("postmodded log:" + postmodded ); 

    return res.render('account/blogdisplaypage', {
      title: 'Public blog page',
      blogs: blog,
      blogname: blogname,
      blognameuc: blognameuc,
      content: blog.post
    });
  });
};


//
// customizer for blog page display
// 
// display individualized css
exports.getPublicBlogCss = (req, res, next) => {

  let blogname = req.params.name
  User.find( {blogname: blogname } , function(err, user) {  
    return res.render('partials/publicblogcss', {
      title: 'Public blog css',
      user: user,
      blogname: blogname
    });
  });
};
 

exports.getBlog = function (req, res, user) {
    Blog.find().sort({updatedAt:-1})


        .exec(function (err, blog_data) {          
            // Successful, so rendecalsr.
            res.render('account/blog', { title: 'Personal Blog', blogs: blog_data });
        })
};


/** 
 * POST /blog
 * Sign in using email and password.
 */

exports.postBlog = (req, res, next) => {
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

  var ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const blog = new Blog({
    userid: req.body.user, 
    username: req.body.username, 
    blogexists: req.body.blogexists,
    posttitle: req.body.posttitle,
    subtext: req.body.subtext,
    blogtitle: req.body.blogtitle,
    blogdesc: req.body.blogdesc,
    authorname: req.body.authorname,
    post: req.body.post,
    location: req.body.location, 
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate,
    iphash: ip,
    template: req.body.template,
    group: req.body.group,
    visibility: req.body.visibility
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



// get a blog post
exports.getUpdateBlogpost = (req, res, next) => {
  Blog.findById(req.params.blogpost_id, function(err, blog) {
    if (blog.userid != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/blogedit', {
      title: 'Edit blog entry',
      blogdata: blog
    });
  });
};
 
// get site page to edit
exports.getUpdateSite = (req, res, next) => {
  Blog.findById(req.params.blogpost_id, function(err, blog) {
    if (blog.userid != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/blogeditmd', {
      title: 'Edit site page',
      blogdata: blog
    });
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
    subtext : req.body.subtext,
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
  Blog.findByIdAndUpdate(blogid, data, function(err, blogpost) {
  if (err) throw err;

  req.flash('success', { msg: 'Your post, "'+blogpost.posttitle+'" has been updated.' });
  res.redirect('/account/blog');
  });
};
