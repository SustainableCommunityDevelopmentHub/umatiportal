const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const cloudinary = require('cloudinary');
const mailChecker = require('mailchecker');
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const csv = require('csv-express');
const path = require('path');
const User = require('../models/User');
const fields = ['_id','userid','username','posttitle','subtext','post','postcat','posttags','iphash','createdAt','updatedAt'];
const Messages = require('../models/Messages');
const randomBytesAsync = promisify(crypto.randomBytes);


exports.getCompose = (req, res) => {
  res.render('account/inboxcompose', {
    title: 'Message composition page'
  });
};



// Display list of Messages
exports.getMessages = function (req, res, next) {

    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/messages', { title: 'Internal messaging', message_list: message_list });
        })
};



// Display Inbox prototype
exports.getInbox = function (req, res, next) {


    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/inbox', { title: 'Internal messaging', message_list: message_list });
        })
};



exports.postMessage = (req, res, next) => {
  const validationErrors = [];

        var db = new Messages();
        var response = {};
        db.username = req.body.username;
        db.name = req.body.name;
        db.source = req.body.source;
        db.amount = req.body.amount;
        db.date = req.body.date;
        db.group = req.body.group;
        db.witness = req.body.witness;
        db.comment = req.body.comment;

        db.save((err) => {
          if (err) {
            if (err.code === 11000) {
              req.flash('errors', { msg: 'There was an error in your update.' });
              return res.redirect('/account/activity');
          }
          return next(err);
          }
          req.flash('success', { msg: 'Account transaction has been registered.' });
          res.redirect('/account/activity');
          });

};



/**
 * GET /account/messagesettings
 * Profile page.
 */
exports.getMessageSettings = (req, res) => {
  res.render('account/messagesettings', {
    title: 'Messaging Settings'
  });
};



/** 
 *  messageController.getUpdateProfileAjax
 * GET /account/profileajax
 * Update entry based on params in the url string
 */
exports.getUpdateMessageAjax = function (req, res, next) {

    var user = req.params.user;
    var item = req.params.item;
    var val = req.params.val;

    if (item === "need_books") var data = { need_books: val };
    if (item === "need_plants") var data = { need_plants: val };
    console.log("messaging system updated. Item id: " + item + ", val: " + val + " user: " + user );

    User.findByIdAndUpdate(user, data, function(err, result) {
    if (err){
         res.send(err);
    }
    else{
         res.status(200);
    };

  });
};


