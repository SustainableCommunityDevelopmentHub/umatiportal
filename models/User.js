const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  personal: String,
  story: String,
  location: String,
  project: String,
  research: String,
  business: String,
  group: String,
  grouplead: String,
  webite: String,
  role: String,
  usecase: String,
  usecaseother: String,
  usecaseother2: String,
  status: String,
  contactmethod: String,
  nicname: String,
  invitecode: String,
  invited: String,
  inviter: String,
  paneldriver: String,
  panelsurplus: String,
  panelrequests: String,
  panelwarehouse: String,
  panelresearch: String,
  donations_avail: String,
  surplus: String,
  item_offered: String,
  item_requested: String,
  pickup_deliver: String,
  warehouse_vol: String,
  need_buildingsupplies: String,
  need_compost: String,
  need_compostpickup: String,
  need_householditems: String,
  need_tools: String,
  need_clothing: String,
  need_books: String,
  need_plants: String,
  need_catfood: String,
  need_dogfood: String,

  snapchat: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  quickbooks: String,
  tokens: Array,

  profile: {
    name: String,
    story: String,
    location: String,
    phone1: String,
    phone2: String,
    address1: String,
    address2: String,
    country: String,
    postalcode: String,
    website: String,
    group: String,
    pickupneed: String,
    story: String,
    business: String,
    vocation: String,
    location: String,
    role: String,
    picture: String,
    salt: String,
    active: Boolean
  },
  groupsettings: {
    groupname: String,
    adminperson: String,
    location: String,
    description: String,
    shortdesc: String,
    memberlist: String,
    visibility: String
  },
  projectsettings: {
    groupname: String,
    adminperson: String,
    location: String,
    description: String,
    shortdesc: String,
    memberlist: String,
    visibility: String
  },
  researchsettings: {
    groupname: String,
    adminperson: String,
    location: String,
    description: String,
    shortdesc: String,
    memberlist: String,
    visibility: String
  },
  bloghomepage: {
    user: String,
    blogid: String,
    element: String,
    title: String,
    authoro: String,
    pubdate: String,
    weblink1: String,
    weblink2: String,
    weblink3: String,
    content1: String,
    content2: String,
    status: String
  },
  blogsettings: {
    user: String,
    blogtitle: String,
    shortdesc: String,
    blogdesc: String,
    blogtags: String,
    template: String,
    visibility: String
  },
  inventorysettings: {
    user: String,
    invtitle: String,
    shortdesc: String,
    invdesc: String,
    invtags: String,
    visibility: String
  },
  calsettings: {
    user: String,
    caltitle: String,
    shortdesc: String,
    caldesc: String,
    caltags: String,
    visibility: String
  },
  locsettings: {
    user: String,
    loctitle: String,
    description: String,
    loccats: String,
    loctags: String,
    visibility: String
  },
  elevsettings: {
    user: String,
    elevtitle: String,
    shortdesc: String,
    elevdesc: String,
    elevtags: String,
    visibility: String
  },
  possettings: {
    user: String,
    postitle: String,
    shortdesc: String,
    posdesc: String,
    postags: String,
    visibility: String
  },
  setup: {
    username: String,
    name: String,
    amount: Number,
    sourcetype: String,
    sourcenum: String,
    postdate: Date,
    iphash: String,
    transhash: String
  },
  business: {
    name: String,
    description: String,
    contactemail: String,
    contactphone: String,
    social1: String,
    social2: String,
    social3: String,
    social4: String,
    social5: String,
    social6: String,
    social7: String,
    businesstags: String,
    postdate: Date,
    members: String,
    weburl: String
  },
  bizsettings: {
    user: String,
    biztitle: String,
    shortdesc: String,
    bizdesc: String,
    biztags: String,
    template: String,
    visibility: String
  },
  messagesettings: {
    user: String,
    name: String,
    hash1: String,
    hash2: String,
    sentto: String,
    sourcetype: String,
    postdate: String,
    status: String,
    visibility: String
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
