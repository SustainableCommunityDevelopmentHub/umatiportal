const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Inventory = require('../models/Inventory');
const Donation = require('../models/Donation');
const User = require('../models/User');
const Loc = require('../models/Loc');
const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/inventory
 * Inventory manager.
 */
// Display list of Member activity.
exports.getInventory = function (req, res, next) {

    Inventory.find()
        .sort([['_id', 'ascending']])
        .exec(function (err, inv_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/inventory', { title: 'Personal Inventory', data: inv_data });
        })
};


/**
 * POST /inventory
 * Sign in using email and password.
 */
exports.postInventory = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'new inventory item cannot be blank.' });
};

/**
 * GET /createinventory
 * new inventory page.
 */
exports.getCreateinventory = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }

  var mysort = { createdAt: -1,  };
  Loc.find()
      .sort(mysort)
      .exec(function (err, loc_list) {
            if (err) { return next(err); }
            res.render('account/createinventory', { title: 'Create Inventory', loc_list: loc_list });
      });
};


/**
 * POST /createpost
 * Create a new local account.
 */
exports.postCreateinventory = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/inventory');
  }

  const inventory = new Inventory({
    name: req.body.name,
    inventorytitle: req.body.inventorytitle,
    user: req.body.user,
    group: req.body.group,
    username: req.body.username, 
    price: req.body.price, 
    post: req.body.post,
    location: req.body.location,
    inventorycat: req.body.inventorycat,
    inventorytags: req.body.inventorytags,
    inventorydate: req.body.inventorydate
  });

  Inventory.findOne({ name: req.body.inventorytitle }, (err, existingInventory) => {
    if (err) { return next(err); }
    if (existingInventory) {
      req.flash('errors', { msg: 'Inventory item with that title already exists.' });
      return res.redirect('/account/inventory');
    }
    inventory.save((err) => {
      if (err) { return next(err); } 
        res.redirect('/account/inventory');
      });
    });
  };


/**
 * POST /account/inventory
 */
exports.postUpdateInventory = (req, res) => {

  var invid = req.body.inventoryitemid;
  var data = {
    user : req.body.user,
    username : req.body.username,
    inventorytitle : req.body.inventorytitle,
    post : req.body.post,
    price : req.body.price,
    location : req.body.location,
    inventorycat : req.body.inventorycat,
    inventorytags : req.body.inventorytags,
    inventorydate : req.body.inventorydate,
    visibility: req.body.visibility
  }
 
  Inventory.findByIdAndUpdate(invid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your Inventory entry has been updated.' });
  res.redirect('/account/inventory');
  });
};



/**
 * GET /account/inventory/#{item}
 */
exports.getUpdateInventory = function (req, res, next) {
  Inventory.findById(req.params.inventoryid, function(err, inventory){
    if(inventory.user != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/inventoryedit', {
      title:'Edit Inventory Item',
      inventory:inventory
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
exports.getCreatedonation = (req, res, next) => {
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
exports.postCreatedonation = (req, res, next) => {
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


exports.getUpdateDonation = function (req, res, next) {
  Donation.findById(req.params.donation_id, function(err, donation){
    if(donation.user != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/donationedit', {
      title:'Edit Donation Item',
      donation:donation
    });
  });
};

/**
 * POST /account/donation
 */
exports.postUpdateDonation = (req, res) => {

  var donid = req.body.donationitemid;
  var data = {
    user : req.body.user,
    username : req.body.username,
    donationtitle : req.body.inventorytitle,
    post : req.body.post,
    price : req.body.price,
    location : req.body.location,
    donationcat : req.body.inventorycat,
    donationtags : req.body.inventorytags,
    donationdate : req.body.inventorydate,
    visibility: req.body.visibility
  }
 
  Donation.findByIdAndUpdate(donid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your Inventory entry has been updated.' });
  res.redirect('/account/donation');
  });
};
