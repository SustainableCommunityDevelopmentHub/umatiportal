const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const calSchema = new mongoose.Schema({
    id: Number,
    username: String,
    calentrytitle: String,
    post: String,
    location: String,
    calcat: String,
    caltags: String,
    date: Date,
    duration: String,
    group: String,
    project: String,
    inventory: String,
    research: String,
    visibility: String,
}, { timestamps: true });

/**
 * Password hash middleware.
*


  var data = {
    user : req.body.user,
    calentrytitle : req.body.caltitle,
    post : req.body.post,
    location : req.body.location,
    calcat : req.body.calcat,
    caltags : req.body.caltags,
    caldate : req.body.caldate,
    time : req.body.time,
    visibility: req.body.visibility

calSchema.pre('save', function save(next) {
  const cal = this;
  if (!cal.isModified('calentrytitle')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(cal.calentrytitle, salt, (err, hash) => {
      if (err) { return next(err); }
      cal.calentrytitle = hash;
      next();
    });
  });
});
 */
 
const Cal = mongoose.model('Cal', calSchema);

module.exports = Cal;


