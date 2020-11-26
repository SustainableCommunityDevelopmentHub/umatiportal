const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const User = require('../models/User');
const Technology = require('../models/Technology');
const Loc = require('../models/Loc');
const Inventory = require('../models/Inventory');
const Donation = require('../models/Donation');
const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/technology
 * Technology manager.
 */
// Display list of Member activity.
exports.getTechnology = function (req, res, next) {

    Technology.find()
        .sort([['_id', 'ascending']])
        .exec(function (err, inv_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/technology', { title: 'Personal Technology', data: inv_data });
        })
};


/**
 * POST /technology
 * Sign in using email and password.
 */
exports.postTechnology = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'new technology item cannot be blank.' });
};

/**
 * GET /createtechnology
 * new technology page.
 */
exports.getCreatetechnology = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }

  var mysort = { createdAt: -1,  };
  Loc.find()
      .sort(mysort)
      .exec(function (err, loc_list) {
            if (err) { return next(err); }
            res.render('account/createtechnology', { title: 'Create Technology', loc_list: loc_list });
      });
};


/**
 * POST /createpost
 * Create a new local account.
 */
exports.postCreatetechnology = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/technology');
  }

  const technology = new Technology({
    name: req.body.name,
    technologytitle: req.body.technologytitle,
    user: req.body.user,
    group: req.body.group,
    username: req.body.username, 
    price: req.body.price, 
    post: req.body.post,
    location: req.body.location,
    technologycat: req.body.technologycat,
    technologytags: req.body.technologytags,
    technologydate: req.body.technologydate
  });

  Technology.findOne({ name: req.body.technologytitle }, (err, existingTechnology) => {
    if (err) { return next(err); }
    if (existingTechnology) {
      req.flash('errors', { msg: 'Technology item with that title already exists.' });
      return res.redirect('/account/technology');
    }
    technology.save((err) => {
      if (err) { return next(err); } 
        res.redirect('/account/technology');
      });
    });
  };


/**
 * POST /account/technology
 */
exports.postUpdateTechnology = (req, res) => {

  var invid = req.body.technologyitemid;
  var data = {
    user : req.body.user,
    username : req.body.username,
    technologytitle : req.body.technologytitle,
    post : req.body.post,
    price : req.body.price,
    location : req.body.location,
    technologycat : req.body.technologycat,
    technologytags : req.body.technologytags,
    technologydate : req.body.technologydate,
    visibility: req.body.visibility
  }
 
  Technology.findByIdAndUpdate(invid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your Technology entry has been updated.' });
  res.redirect('/account/technology');
  });
};



/**
 * GET /account/technology/#{item}
 */
exports.getUpdateTechnology = function (req, res, next) {
  Technology.findById(req.params.technologyid, function(err, technology){
    if(technology.user != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/technologyedit', {
      title:'Edit Technology Item',
      technology:technology
    });
  });
};



/**
 * GET /account/donation
 * Donation manager.
 */
// Display list of Member activity.
exports.getDonation = function (req, res, next) {

    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/donation', { title: 'Donations', data: donation_data });
        })
};



/**
 * GET /createdonation
 * handle new donation form
 */
exports.getCreateDonation = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }

  var mysort = { createdAt: -1,  };
  Loc.find()
      .sort(mysort)
      .exec(function (err, loc_list) {
	    if (err) { return next(err); }
	    res.render('account/createdonation', { title: 'Create Donation', loc_list: loc_list });
      });
};

/**
 * POST /createdonation
 * Create a new donation
 */
exports.postCreateDonation = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.donationname)) validationErrors.push({ msg: 'Please enter a title for your new donation item.' });
  if (!validator.isAscii(req.body.description)) validationErrors.push({ msg: 'Please add some descriptive content to your donation item.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/donation');
  }

  const donation = new Donation({
    donationname: req.body.donationname,
    user: req.body.user,
    group: req.body.group,
    project: req.body.project,
    value: req.body.value,
    description: req.body.description,
    location: req.body.location,
    donationcat: req.body.donationcat,
    donationtags: req.body.donationtags,
    donationdate: req.body.donationdate,
    donationnote: req.body.donationnote,
    donationdate2: req.body.donationdate2,
    donationnote2: req.body.donationnote2
  });

  Donation.findOne({ name: req.body.donationname }, (err, existingDonation) => {
    if (err) { return next(err); }
    if (existingDonation) {
      req.flash('errors', { msg: 'Donation with that title already exists.' });
      return res.redirect('/account/donation');
    }
    donation.save((err) => {
      if (err) { return next(err); }
        res.redirect('/account/donation');
      });
    });
  };


exports.getUpdateDonation = function (req, res, user) {
  Donation.findById(req.params.donation_id, function(err, donation){

    return res.render('account/donationedit', {
      title:'Edit Donation Item',
      donation:donation
    });
  });
};

/**
 * POST /account/donation
 */
exports.postUpdateDonation = (req, res, next) => {

  var donationid = req.body.donationitemid;
  var data = {
    user : req.body.user,
    username : req.body.username,
    donationtitle : req.body.donationtitle,
    post : req.body.post,
    price : req.body.price,
    location : req.body.location,
    donationcat : req.body.donationcat,
    donationtags : req.body.donationtags,
    donationdate : req.body.donationdate,
    visibility: req.body.visibility
  }
 
  Donation.findByIdAndUpdate(donationid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your donation item has been updated.' });
  res.redirect('/account/donation');
  });
};
