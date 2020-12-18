const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Groupdata = require('../models/Groupdata');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/

// Display data for group admin person to review
//
exports.getGroupAdminPanel = function (req, res, user) {

    var thisgroup = user.group
    User.find({ 'group': thisgroup }, 'profile.name need_dogfood need_plants need_compost need_catfood need_tools need_buildingsupplies need_compostpickup need_books need_householditems offer_clothing offer_plants offer_books offer_compost offer_compostpickup offer_householditems offer_tools offer_dogfood item_offered item_requested usecase_foodsecurity', function (err, groupdata ) {
      if (err) return handleError(err); 
      res.render('account/groupadminpanel', { title: 'Group', groupdata: groupdata });
    })
};


exports.getGroupStatus = function (req, res, user) {

  console.log( "mygroup: " + user.group ); 
  User.find({}, function(err, users) { 
    var userMap = {}; 
    users.forEach(function(user) { 
      userMap[user._id] = user; 
    }); 
      res.render('account/groupstatus', { title: 'Group status', groupdata: userMap });
  // res.send(userMap); 
  }); 
};

exports.getUserlist = function (req, res, user) {

  User.find({}, function(err, users) { 
    var userMap = {}; 
    users.forEach(function(user) { 
      userMap[user._id] = user; 
    }); 
      res.render('account/userlist', { title: 'Group status', groupdata: userMap });
  }); 
};

exports.getUserstatus = function (req, res, user) {


  User.find({}, function(err, users) {

    var userMap = {}; 
    users.forEach(function(user) { 
      userMap[user._id] = user; 
    }); 
      res.render('account/userstatus', { title: 'Group status', groupdata: userMap });
  // res.send(userMap); 
  }); 
};

exports.getUserjson = function (req, res, user) {

  User.find({}, function(err, users) { 
    var userMap = {}; 
    users.forEach(function(user) { 
      userMap[user._id] = user; 
    }); 
   res.send(userMap); 
  }); 
};


/**
    Groupdata.find()
        .sort([['name', 'ascending']])
        .exec(function (err, group_data) {
            if (err) { return next(err); }
            // Successful, so render page
            res.render('account/groupadminpanel', { title: 'Group', groupdata: group_data });
        })
};

**/


// Display list of Member activity.
exports.getGroupdata = function (req, res, next) {

    Groupdata.find()
        .sort([['name', 'ascending']])
        .exec(function (err, group_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/group', { title: 'Group', groupdata: group_data });
        })
};

// Display list of Member activity.
exports.getGroupdatasheet1 = function (req, res, next) {

    Groupdata.find()
        .sort([['name', 'ascending']])
        .exec(function (err, group_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/groupdatasheet1', { title: 'Dataview1', groupdata: group_data });
        })
};


 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postGroupdata = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Group name cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getPosEntry = (req, res) => {
  res.render('account/posentryedit', {
    title: 'Edit point of sale entry'
  });
};




/**
 * GET /createpost
 * Signup page.
 */
exports.getCreategroupdata = (req, res) => {
  res.render('account/creategroup', {
    title: 'Create new group entry'
  });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreatesubgroupdata = (req, res) => {
  res.render('account/createsubgroup', {
    title: 'Create new sub group'
  });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreategroupnote = (req, res) => {
  res.render('account/creategroupnote', {
    title: 'Create new note to be seen internally by members of your groups.'
  });
};



/**
 * POST /necal  postCreategroupdata
 * Create a new local account.
 */
exports.postCreategroupdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/creategroup');
  }

  const groupdata = new Groupdata({
    name: req.body.name,
    admin: req.body.admin,
    group: req.body.group,
    secret: req.body.secret,
    post: req.body.post, 
    location: req.body.location, 
    sourcenum: req.body.sourcenum,
    sourcename: req.body.sourcename,
    sourcetype: req.body.sourcetype,
    date: req.body.posdate,
    witness: req.body.witness,
    comment: req.body.comment
  });

  Groupdata.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Group entry with that title already exists.' });
      return res.redirect('/account/creategroup');
    }
    groupdata.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/creategroupnote');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Group note created.' });
      res.redirect('/account/group');
    });
  });
};


/**
 * POST /account/  
 * Update cal information.
 */
exports.postUpdateGroupdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/group');
  }

  Groupdata.findById(req.groupdata.id, (err, user) => {
    if (err) { return next(err); }
    groupdata.name = req.body.name || '';
    groupdata.admin = req.body.admin || '';
    groupdata.secret = req.body.secret || '';
    groupdata.amount = req.body.amount || '';
    groupdata.sourcename = req.body.sourcename || '';
    groupdata.sourcenum = req.body.sourcenum || '';
    groupdata.sourcetype = req.body.sourcetype || '';
    groupdata.transhash = req.body.transhash || '';
    groupdata.date = req.body.date || '';
    groupdata.group = req.body.group || '';
    groupdata.witness = req.body.witness || '';
    groupdata.comment = req.body.comment || '';
    groupdata.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your group update.' });
          return res.redirect('/account/group');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Group entry has been registered.' });
      res.redirect('/account/group');
    });
  });
};

