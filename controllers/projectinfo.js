const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Project = require('../models/Project');
const User = require('../models/User');


// app.get('/projectinfo', userController.getProjectinfo);
// app.get('/account/projectinfo', passportConfig.isAuthenticated, projectinfoController.getProjectinfo);
// app.get('/account/projectinfo', passportConfig.isAuthenticated, projectinfoController.getProjectinfo);
// app.post('/account/projectinfo', passportConfig.isAuthenticated, projectinfoController.postProjectinfo);
// app.get('/account/createprojectinfo', passportConfig.isAuthenticated, projectinfoController.getCreateprojectinfo);
// app.post('/account/createprojectinfo', passportConfig.isAuthenticated, projectinfoController.postCreateprojectinfo);




const randomBytesAsync = promisify(crypto.randomBytes);



// Display list of Project info
exports.getProjectinfo = function (req, res, next) {

    Projectinfo.find()
        .sort([['name', 'ascending']])
        .exec(function (err, project_info) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/projectinfo', { title: 'Project info', projectinfo: project_info });
        })
};


/*
* POST project data
* Sign in using email and password.
*/
exports.postProjectinfo = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Project info name cannot be blank.' });
};


/**
 * GET /createprojectinfo
 */
exports.getCreateprojectinfo = (req, res) => {
  res.render('account/createprojectinfo', {
    title: 'Create new project info entry'
  });
};


/**
 * POST  postCreateprojectinfo
 * Create a new local account.
 */
exports.postCreateprojectinfo = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createprojectinfo');
  }

  const projectinfo = new Projectinfo({
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

  Projectinfo.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Project info entry with that title already exists.' });
      return res.redirect('/account/createprojectinfo');
    }
    projectdata.save((err) => {
      if (err) { 
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/createprojectinfo');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project information entry created.' });
      res.redirect('/account/projectinfo');
    });
  });
};


/**
 * POST /account/project  
 * Update project information.
 */
exports.postUpdateProjectinfo = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/projectinfo');
  }

  Projectinfo.findById(req.projectinfo.id, (err, user) => {
    if (err) { return next(err); }
    projectinfo.name = req.body.name || '';
    projectinfo.admin = req.body.admin || '';
    projectinfo.secret = req.body.secret || '';
    projectinfo.amount = req.body.amount || '';
    projectinfo.sourcename = req.body.sourcename || '';
    projectinfo.sourcenum = req.body.sourcenum || '';
    projectinfo.sourcetype = req.body.sourcetype || '';
    projectinfo.transhash = req.body.transhash || '';
    projectinfo.date = req.body.date || '';
    projectinfo.project = req.body.project || '';
    projectinfo.witness = req.body.witness || '';
    projectinfo.comment = req.body.comment || '';
    projectinfo.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your project info update.' });
          return res.redirect('/account/projectinfo');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project info entry has been registered.' });
      res.redirect('/account/projectinfo');
    });
  });
};

