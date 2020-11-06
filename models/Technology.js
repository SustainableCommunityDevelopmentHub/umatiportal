const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const TechnologySchema = new mongoose.Schema({
  user: String,
  role: String,
  technologyName: String,
  infrastructureSystemType: String,
  project: String,
  date: Date,
  participants: String,
  contactperson: String,
  group: String,
  sourcename: String,
  sourcetype: String,
  refulr01: String,
  refurl02: String,
  refurl03: String,
  refurl04: String,
  refurl05: String,
  refurl06: String,
  refurl07: String,
  refurl08: String,
  refurl09: String,
  refurl10: String,
  refurl11: String,
  refurl12: String,
  refurl13: String,
  refurl14: String,
  refurl15: String,
  refurl16: String,
  refurl17: String,
  refurl18: String,
  refurl19: String,
  refurl20: String,
  secret: String,
  sauce: String,
  salt: String,
  comment: String
 }, { timestamps: true });

const Technology = mongoose.model('Technology', technologySchema);

module.exports = Technology;
