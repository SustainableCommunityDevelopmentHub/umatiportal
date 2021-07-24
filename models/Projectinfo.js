const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const projectinfoSchema = new mongoose.Schema({
  user: String,
  role: String,
  project: String,
  date: Date,
  participants: String,
  contactperson: String,
  group: String,
  sourcename: String,
  sourcetype: String,
  refulr1: String,
  refurl2: String,
  refurl3: String,
  secret: String,
  comment: String
 }, { timestamps: true });

const Projectinfo = mongoose.model('Projectinfo', projectinfoSchema);

module.exports = Projectinfo;
