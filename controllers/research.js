const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Research = require('../models/Research');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getResearch = function (req, res, next) {

    Research.find()
        .sort([['name', 'ascending']])
        .exec(function (err, research_data) {
            if (err) { return next(err); }
            res.render('account/research', { title: 'Research', researchdata: research_data });
        })
};


// Display list of Member activity.
exports.getResearchs = function (req, res, next) {

    Research.find()
        .sort([['name', 'ascending']])
        .exec(function (err, research_data) {
            if (err) { return next(err); }
            res.render('account/researchs', { title: 'Researchs', researchdata: research_data });
        })
};





// Display list of Research info
exports.getResearchdata = function (req, res, next) {

    Research.find()
        .sort([['name', 'ascending']])
        .exec(function (err, research_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/researchdata', { title: 'Research data', researchdata: research_data });
        })
};


/*
* POST /cal
* Sign in using email and password.
*/
exports.postResearchdata = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Research name cannot be blank.' });
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
 * GET /createresearchnote
 * Signup page.
 */
exports.getCreateresearchnote = (req, res) => {
  res.render('account/createresearchnote', {
    title: 'Create a note for the research'
  });
};

/**
 * GET /createresearch
 * Signup page.
 */
exports.getCreateresearchdata = (req, res) => {
  res.render('account/createresearch', {
    title: 'Create new research entry'
  });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreatesubresearchdata = (req, res) => {
  res.render('account/createsubresearch', {
    title: 'Create new sub research'
  });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreateresearchnote = (req, res) => {
  res.render('account/createresearchnote', {
    title: 'Create new note to be seen internally by members of your researchs.'
  });
};


/**
 * POST  postCreateresearchnote
 * Create a new local account.
 */
exports.postCreateresearchnote = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createresearchnote');
  }

  const research = new Research({
    name: req.body.name,
    admin: req.body.admin,
    research: req.body.research,
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

  Research.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Research entry with that title already exists.' });
      return res.redirect('/account/createresearch');
    }
    research.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/createresearchnote');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Research note created.' });
      res.redirect('/account/research');
    });
  });
};



/**
 * POST  postCreateresearchdata
 * Create a new local account.
 */
exports.postCreateresearchdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createresearch');
  }

  const Research = new Research({
    name: req.body.name,
    admin: req.body.admin,
    research: req.body.research,
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

  Research.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Research entry with that title already exists.' });
      return res.redirect('/account/createresearch');
    }
    researchdata.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/createresearchnote');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Research note created.' });
      res.redirect('/account/research');
    });
  });
};


/**
 * POST /account/research  
 * Update research information.
 */
exports.postUpdateResearchdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/research');
  }

  Research.findById(req.researchdata.id, (err, user) => {
    if (err) { return next(err); }
    researchdata.name = req.body.name || '';
    researchdata.admin = req.body.admin || '';
    researchdata.secret = req.body.secret || '';
    researchdata.amount = req.body.amount || '';
    researchdata.sourcename = req.body.sourcename || '';
    researchdata.sourcenum = req.body.sourcenum || '';
    researchdata.sourcetype = req.body.sourcetype || '';
    researchdata.transhash = req.body.transhash || '';
    researchdata.date = req.body.date || '';
    researchdata.research = req.body.research || '';
    researchdata.witness = req.body.witness || '';
    researchdata.comment = req.body.comment || '';
    researchdata.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your research update.' });
          return res.redirect('/account/research');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Research entry has been registered.' });
      res.redirect('/account/research');
    });
  });
};

