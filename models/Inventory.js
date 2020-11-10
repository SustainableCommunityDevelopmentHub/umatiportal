const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const inventorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    user: String,
    username: String,
    inventorytitle: String,
    price: String,
    post: String,
    visibility: String,
    location: String,
    inventorycat: String,
    inventorytags: String,
    inventorydate: Date,
    description_of_tech: String,
    components: String,
    schemtatics: String,
    cost: String,
    operation_and_maint: String,
    technical_knowledge: String,
    environmental_impact: String,
    cultural_factors: String,
    other_factors: String,
    sources: String,
    sharedwith: Array,
}, { timestamps: true });

/**
 * Password hash middleware.
*



blogSchema.pre('save', function save(next) {
  const blog = this;
  if (!blog.isModified('posttitle')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(blog.posttitle, salt, (err, hash) => {
      if (err) { return next(err); }
      pos.posttitle = hash;
      next();
    });
  });
});
 */
 
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
