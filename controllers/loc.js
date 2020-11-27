const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Loc = require('../models/Loc');
const User = require('../models/User');
    
const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /account/loc
 * Locational data manager.
 */



exports.getLocupdated = function (req, res, user) {
    
            // Successful, so rendecalsr.
            res.render('account/locupdated', { title: 'Loc updated'});
};

exports.getHumanrights = function (req, res, blog) {
 
    Loc.find()
        .exec(function (err, loc_data) {          
            // Successful, so ..
            res.render('humanrights', { title: 'Human Rights Portal', locs: loc_data });
        })
};


exports.getLocOpenstreetmap = function (req, res, user) {
 
    Loc.find()
        .exec(function (err, loc_data) {          
            // Successful, so ..
            res.render('account/locosm', { title: 'Location via OSM', locs: loc_data });
        })
};

exports.getLocation = function (req, res, user) {
    
    Loc.find()
        .exec(function (err, loc_data) {          
            // Successful, so ..
            res.render('account/location', { title: 'Location map', locs: loc_data });
        })
};



exports.getLoc = (req, res) => {

  const locs = Loc.list;
  res.render('account/loc', {
    title: 'Loction manager'
  });
};

/** 
 * POST /loc
 * Sign in using email and password.
 */
exports.postLoc = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.blogpost)) validationErrors.push({ msg: 'Loc item cannot be blank.' });
};


/*
 * POST /account/upload
 * Sign in using email and password.
 */
exports.postUpload = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.locpost)) validationErrors.push({ msg: 'Loc post cannot be blank.' });
};




/**
 * GET /createloc
 * Signup page.
 */
exports.getCreateloc = (req, res) => {
  res.render('account/createloc', {
    title: 'Create Locx'
  });
};

/**
 * POST /createloc
 * Create new location data
 */
exports.postCreateloc = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.loctitle)) validationErrors.push({ msg: 'Please enter a title for your new location.' });
// if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your location.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/loc');
  }

  const loc = new Loc({
    loctitle: req.body.loctitle,
    description: req.body.post, 
    group: req.body.group, 
    username: req.body.user, 
    location: req.body.location, 
    loccat: req.body.postcat,
    loctags: req.body.posttags,
    lat: req.body.lat,
    long: req.body.long
  });

  Loc.findOne({ loctitle: req.body.loctitle }, (err, existingLoc) => {
    if (err) { return next(err); }
    if (existingLoc) {
      req.flash('errors', { msg: 'Loc with that title already exists.' });
      return res.redirect('/account/loc');
    }
    loc.save((err) => {
      if (err) { return next(err); }
      res.redirect('/account/loc');
    });
  });
};




// get a location item
exports.getUpdateLocpost = (req, res, next) => {
  Loc.findById(req.params.locpost_id, function(err, loc) {
    if (loc.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/locedit', {
      title: 'Edit loc entry',
      locdata: loc
    });
  });
};
 


exports.postUpdateLocpost = (req, res, next) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  let id = req.params.locpost_id;
  var data = {
    user : req.body.user,
    username : req.body.user,
    loctitle : req.body.posttitle,
    authorname : req.body.authorname,
    description : req.body.post,
    location : req.body.location,
    lat : req.body.location,
    long : req.body.location,
    url : req.body.url,
    url2 : req.body.url2,
    url3 : req.body.url3,
    loccat : req.body.postcat,
    loctags : req.body.posttags,
    postdate : req.body.postdate,
    sharedwith : req.body.sharedwith
  }
 
  // save the user
  Loc.findByIdAndUpdate(id, data, function(err, locpost) {
  if (err) throw err;
 
  res.send('Successfully! Loc updated - '+locpost.name);
  });
};


exports.postUpdateLoc = (req, res) => {
  // update and send back entries after update
  // create mongoose method to update a existing record into collection


  var locid = req.body.locpost_id;
  var data = {
    user : req.body.user,
    username : req.body.username,
    loctitle : req.body.loctitle,
    authorname : req.body.authorname,
    description : req.body.post,
    location : req.body.location,
    lat : req.body.lat,
    long : req.body.long,
    loccat : req.body.loccat,
    loctags : req.body.loctags,
    locdate : req.body.locdate,
    iphash : req.body.iphash,
    transhash : req.body.transhash,
    group : req.body.group,
    visibility: req.body.visibility
  }

  // save the update
  Loc.findByIdAndUpdate(locid, data, function(err, pos) {
  if (err) throw err;

  req.flash('success', { msg: 'Your loc info has been updated.' });
  res.redirect('/account/loc');
  });
};
