const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Projectdata = require('../models/Project');
const Projectinfo = require('../models/Projectinfo');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getProject = function (req, res, next) {

    Project.find()
        .sort([['name', 'ascending']])
        .exec(function (err, project_data) {
            if (err) { return next(err); }
            res.render('account/project', { title: 'Project', projectdata: project_data });
        })
};


// Display list of Member activity.
exports.getProjects = function (req, res, next) {

    Project.find()
        .sort([['name', 'ascending']])
        .exec(function (err, project_data) {
            if (err) { return next(err); }
            res.render('account/projects', { title: 'Projects', projectdata: project_data });
        })
};


// Display projectinfo page
exports.getProjectinfo = function (req, res, next) {

    Projectinfo.find()
        .sort([['name', 'ascending']])
        .exec(function (err, project_info) {
            if (err) { return next(err); }
            res.render('account/projectinfo', { title: 'Project Info', projectinfo: project_info });
        })
};




// Display list of Project info
exports.getProjectdata = function (req, res, next) {

    Projectdata.find()
        .sort([['name', 'ascending']])
        .exec(function (err, project_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/projectdata', { title: 'Project data', projectdata: project_data });
        })
};


/*
* POST project data
* Sign in using email and password.
*/
exports.postProjectdata = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Project name cannot be blank.' });
};



/**
 * GET 
 */
exports.getPosEntry = (req, res) => {
  res.render('account/posentryedit', {
    title: 'Edit point of sale entry'
  });
};

/**
 * GET /createprojectnote
 */
exports.getCreateprojectnote = (req, res) => {
  res.render('account/createprojectnote', {
    title: 'Create a note for the project'
  });
};

/**
 * GET /createproject
 */
exports.getCreateprojectdata = (req, res) => {
  res.render('account/createproject', {
    title: 'Create new project entry'
  });
};

/**
 * GET /createpost
 */
exports.getCreatesubprojectdata = (req, res) => {
  res.render('account/createsubproject', {
    title: 'Create new sub project'
  });
};

/**
 * GET /createpost
 */
exports.getCreateprojectnote = (req, res) => {
  res.render('account/createprojectnote', {
    title: 'Create new note to be seen internally by members of your projects.'
  });
};


/**
 * POST  postCreateprojectnote
 */
exports.postCreateprojectnote = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createprojectnote');
  }

  const projectdata = new Projectdata({
    name: req.body.name,
    admin: req.body.admin,
    project: req.body.project,
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

  Projectdata.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Project entry with that title already exists.' });
      return res.redirect('/account/createproject');
    }
    projectdata.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/createprojectnote');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project note created.' });
      res.redirect('/account/project');
    });
  });
};



/**
 * POST  postCreateprojectdata
 * Create a new local account.
 */
exports.postCreateprojectdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createproject');
  }

  const projectdata = new Projectdata({
    name: req.body.name,
    admin: req.body.admin,
    project: req.body.project,
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

  Projectdata.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Project entry with that title already exists.' });
      return res.redirect('/account/createproject');
    }
    projectdata.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/createprojectnote');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project note created.' });
      res.redirect('/account/project');
    });
  });
};


/**
 * POST /account/project  
 * Update project information.
 */
exports.postUpdateProjectdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/project');
  }

  Projectdata.findById(req.projectdata.id, (err, user) => {
    if (err) { return next(err); }
    projectdata.name = req.body.name || '';
    projectdata.admin = req.body.admin || '';
    projectdata.secret = req.body.secret || '';
    projectdata.amount = req.body.amount || '';
    projectdata.sourcename = req.body.sourcename || '';
    projectdata.sourcenum = req.body.sourcenum || '';
    projectdata.sourcetype = req.body.sourcetype || '';
    projectdata.transhash = req.body.transhash || '';
    projectdata.date = req.body.date || '';
    projectdata.project = req.body.project || '';
    projectdata.witness = req.body.witness || '';
    projectdata.comment = req.body.comment || '';
    projectdata.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your project update.' });
          return res.redirect('/account/project');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project entry has been registered.' });
      res.redirect('/account/project');
    });
  });
};

