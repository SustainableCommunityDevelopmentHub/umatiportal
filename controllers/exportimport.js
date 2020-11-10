const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');

// mongo db models for export/import
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Donation = require('../models/Donation');
const Groupdata = require('../models/Groupdata');
const Inventory = require('../models/Inventory');
const Loc = require('../models/Loc');
const Media = require('../models/Media');
const Member = require('../models/Member');
const Messages = require('../models/Messages');
const Project = require('../models/Project');
const Research = require('../models/Research');
const Technology = require('../models/Technology');
const User = require('../models/User');





const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
