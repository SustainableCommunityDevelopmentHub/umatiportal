const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Contact = require('../models/Contact');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);


// Display contacts
exports.getContactPage = function (req, res, next) {

    Contact.find()
        .sort([['date', 'ascending']])
        .exec(function (err, contact) {
            if (err) { return next(err); }
            res.render('account/contactpage', { title: 'Contact', contact: contact });
        })
};



 /*
 * POST /clinic/get-started
 *  SCD Clinic - get started page
 */
exports.getClinicGetStarted = (req, res, next) => {
            res.render('startaclinic', { title: 'Start a clinic page' });
};
exports.getClinicGetStarted2 = (req, res, next) => {
            res.render('clinic/get-started2', { title: 'Start a clinic page 2' });
};




/**
 * GET /roadmap
 * Roadmap page.
 */
exports.getRoadmap = (req, res) => {
  res.render('roadmap', {
    title: 'Roadmap'
  });
};


/**
 * GET /account/createcontact
 * Signup page.
 */
exports.getCreatecontact = (req, res) => {
  res.render('account/createcontact', {
    title: 'Create entry'
  });
};

/**
 * GET /privacy
 * Signup page.
 */
exports.getPrivacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy Statement'
  });
};


/**
 * POST /account/createcontact
 * Create a new local account.
 */
exports.postCreateContactEntry = (req, res) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.name)) validationErrors.push({ msg: 'Please enter a title for your new entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/calentrycreate');
  }

  const cal = new Cal({
    name: req.body.name,
    user: req.body.user,
    visibility: req.body.visibility,
    comment: req.body.comment,
    address1: req.body.addres1,
    address2: req.body.addres2,
    country: req.body.country,
    postalcode: req.body.postalcode,
    vetted: req.body.vetted,
    phoneh: req.body.phoneh,
    phoneb: req.body.phoneb,
    source: req.body.source,
    group: req.body.group,
    project: req.body.project,
    iphash: req.body.iphash, 
    transhash: req.body.transhash
  });

  Cal.findOne({ calentrytitle: req.body.calentrytitle }, (err, existingCal) => {
    if (err) { return next(err); }
    if (existingCal) {
      req.flash('errors', { msg: 'Calendar entry with that title already exists.' });
      return res.redirect('/account/calentrycreate');
    }
    cal.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/cal');
      });
    });
  });
};



/**
 * POST /account/calendar
 * Update cal information.
 */
exports.postUpdateContactEntry = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/contactcreate');
  }

  Contact.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    contact.name = req.body.name || '';
    contact.user = req.body.user || '';
    contact.visibility = req.body.visibility || '';
    contact.comment = req.body.comment || '';
    contact.address1 = req.body.address1 || '';
    contact.address2 = req.body.address2 || '';
    contact.country = req.body.posgtdate || '';
    contact.postalcode = req.body.postalcode || '';
    contact.vetted = req.body.vetted || '';
    contact.phoneh = req.body.phoneh || '';
    contact.phoneb = req.body.phoneb || '';
    contact.source = req.body.source || '';
    contact.group = req.body.group || '';
    contact.project = req.body.project || '';
    contact.iphash = req.body.iphash || '';
    contact.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your calendar update.' });
          return res.redirect('/account/calendar');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Calendar entry has been registered.' });
      res.redirect('/account/calendar');
    });
  });
};

