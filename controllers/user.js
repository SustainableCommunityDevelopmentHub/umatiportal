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
const Blog = require('../models/Blog');
const fields = ['_id','userid','username','posttitle','subtext','post','postcat','posttags','iphash','createdAt','updatedAt'];
const Member = require('../models/Member');
const Messages = require('../models/Messages');
const randomBytesAsync = promisify(crypto.randomBytes);

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

exports.getExportToCsv = (req, res, next) => {
    var filename   = "umati_blogdata.csv";
    var dataArray;
    Blog.find().lean().exec({}, function(err, blogdata) {
        if (err) res.send(err);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(blogdata, true);
    });
 };


exports.getContactpage = (req, res) => {
  res.render('contact', {
    title: 'Contact page'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};


/**
 * getPublicGroupPage
 */
exports.getPublicGroupPage = (req,res,next) => {
  res.render('account/templategroup', {
    title: 'Group page'
  });
}


/** getDisplayPublicProfile
 * getDisplayPublicProfile
 */
exports.getDisplayPublicProfile = (req,res,next) => {
  res.render('/publicprofile', {
    title: 'Public profile'
  });
}


/**
 * getPublicProjectPage
 */
exports.getPublicProjectPage = (req,res,next) => {
  res.render('account/templateproject', {
    title: 'Project page'
  });
}

/**
 * getPublicBusinessPage
 */
exports.getPublicBusinessPage = (req,res,next) => {
  res.render('account/templatebusiness', {
    title: 'Business page'
  });
}

/**
 * getPublicUserPage
 */
exports.getPublicUserPage = (req,res,next) => {
  res.render('account/templateuser', {
    title: 'Public user page'
  });
}

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * GET /signup
 * Signup page.
 */

exports.getMultSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signupmult', {
    title: 'gimme 3 steps'
  });
};


/**
 * GET /account/signupgroup
 * Signup page.
 */

exports.getGroupSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signupgroup', {
    title: 'Group account'
  });
};

/**
 * GET /account/signupresearch
 * Signup page.
 */
exports.getResearchSignup = (req, res) => {
    res.render('account/signupresearch', {
      title: 'New Research Signup account'
    });
};

/**
 * GET /account/signupproposal
 * Signup page.
 */
exports.getProposalSignup = (req, res) => {
    res.render('account/signupproposal', {
      title: 'New Proposal Signup'
    });
};


/**
 * GET /signupresearch
 * Research Signup page. - for not logged in users
 */
exports.getResearchSignupPublic = (req, res) => {
    res.render('signupresearch', {
      title: 'Research Signup account for existing user'
    });
};


/**
 * GET /groupsignup
 * Signup page.
 */
exports.getGroupSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signupgroup', {
    title: 'Create group form'
  });
};

/**
 * GET /projectsignup
 * Signup page.
 */
exports.getProjectSignup = (req, res) => {
  res.render('account/signupproject', {
    title: 'Create project form'
  });
};


/**
 * GET /projectsignup
 * Signup page.
 */
exports.getProjectSignupPublic = (req, res) => {
  res.render('signupproject', {
    title: 'Public facing project form'
  });
};



/**
 * GET /account/supportedsignup
 * Signup page.
 */
exports.getSupportedsignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/supportedsignup', {
    title: 'Create Paid Account'
  });
};


/**
 * GET /account/prioritysupport
 * Page that explains benefits of priority support
 */
exports.getPrioritysupport = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/prioritysupport', {
    title: 'Benefits of priority support'
  });
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    personal: req.body.personal,
    group: req.body.group,
    blogname: req.body.blogname,
    academicinst: req.body.academicinst,
    research: req.body.research,
    project: req.body.project,
    proposal: req.body.proposal,
    business: req.body.business,
    tags: req.body.tags,
    nicname: req.body.nicname,
    usecase: req.body.usecase,
    usecaseother: req.body.usecaseother,
    usecaseother2: req.body.usecaseother2,
    status: req.body.status,
    statusdetl: req.body.statusdetl,
    grouplead: req.body.grouplead,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: 'welcome, thank you for talking the  time  to create an account here on Umati Portal.' });
        res.redirect('/');
      });
    });
  });
};


/**
 */
exports.getConfirmDelete = (req, res) => {
  res.render('account/deleteconfirm', {
    title: 'Confirm Delete'
  });
};


/**
 * GET /groupsignup
 * Signup page.
 */
exports.getGroupSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/account/groupsettings');
  }
  res.render('account/signupgroup', {
    title: 'Create group form'
  });
};


/**
 * get /account/backup/csv/:option
 *  csv data export
**/
exports.getBackupCsv = (req, res) => {

  if (req.user) {
    return res.redirect('/');
  }

};

/**
 * get /account/backup/json/:option
 *  json data export
**/
exports.getBackupJson = (req, res) => {
  // userparam = req.params.user;
  // user._id
  console.log('user id hope: ' + userparam + ' boom!');
  if (req.user) {
    return res.redirect('/');
  }


  Blog.file({userid: "5fa296e34428b663aa96668d"}, function (err, blog) {
      if (err) {
      return res.status(500).json({ err });
    }
    else {
      let csv
      try {
        csv = json2csv(blog, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }
      const dateTime = moment().format('YYYYMMDDhhmmss');
      const filePath = path.join(__dirname, "..", "public", "exports", "csv-" + dateTime + ".csv")
      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          setTimeout(function () {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000)
          return res.json("/exports/csv" + userparam + "-" + dateTime + ".csv");
        }
      });

    }



  });
};


/**
 * GET /account/backup
 */
exports.getBackup = (req, res) => {
  if (req.user) {
    res.render('account/backup', {
      title: 'Private account data backup request form page'
    });
  }
};

exports.getLink = function (req, res, next) {
  username = req.params.username;
  res.render('link')
  };



/**
 * GET /avatared
 * Food Group Signup page.
 */
exports.getAvatared = (req, res) => {
  let options = {};
  let avatars = new Avatars(sprites, options);
  let svg = avatars.create('custom-seed');
    res.render('account/avatared', {
    title: 'Create Avatars'
  });
};



/**
 * GET /account/setup
 * member payment account settings page.
 */

exports.getSetup = (req, res) => {
  res.render('account/setup', {
    title: 'Account settings'
  });
};


// Display list of Member activity.
exports.getActivity = function (req, res, next) {

    var mysort = { createdAt: -1,  };
    Member.find()
        .sort(mysort)
        .exec(function (err, list_activity) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/activity', { title: 'Account Ledger', activity_list: list_activity });
        })
};


// Display list of Member activity.
exports.getActivityprint = function (req, res, next) {

    Member.find()
        .sort([['date', 'ascending']])
        .exec(function (err, list_activity) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/activity-print', { title: 'Account Ledger', activity_list: list_activity });
        })
};


exports.getMember = (req, res) => {
  res.render('account/membercreate', {
    title: 'Business transaction'
  });
};

exports.getRequestMember = (req, res) => {
  res.render('account/memberrequest', {
    title: 'Member Request'
  });
};

exports.getJexcel = (req, res) => {
  res.render('account/jexcel', {
    title: 'Jexcel'
  });
};



exports.postMember = (req, res, next) => {
  const validationErrors = [];

        var db = new Member();
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


exports.getPrivacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy'
  });
};

exports.getProjects = (req, res) => {
  res.render('projects', {
    title: 'Projects'
  });
};


exports.getPong = (req, res) => {
  res.render('games/pong', {
    title: 'Pong'
  });
};

exports.getSi = (req, res) => {
  res.render('games/si', {
    title: 'Space Invaders old skool therapeutic game fun'
  });
};

/**
 * POST /account/setup
 * Update setup info.
 */
exports.postUpdateSetup = (req, res, next) => {
  const validationErrors = [];
/**  if (!validator.isEmail(req.body.amount)) validationErrors.push({ msg: 'Please enter a valid payment amount.' });
 */

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/setup');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.setup.name = req.body.name || '';
    user.setup.amount = req.body.amount || '';
    user.setup.sourcetype = req.body.sourcetype || '';
    user.setup.sourcenum = req.body.sourcenum || '';
    user.setup.postdate = req.body.postdate || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/setup');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Settings have been updated.' });
      res.redirect('/account/setup');
    });
  });
};

/**
 * GET /account/business
 * Business configuration page.
 */
exports.getBusiness = (req, res) => {
  res.render('account/business', {
    title: 'Business description'
  });
};

/**
 * POST /account/business
 * Update blog information.
 */
exports.postUpdateBusiness = (req, res, next) => {
  const validationErrors = [];
/**  if (!validator.isEmail(req.body.amount)) validationErrors.push({ msg: 'Please enter a valid payment amount.' });
 */

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/business');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.business.name = req.body.name || '';
    user.business.description = req.body.description || '';
    user.business.contactemail = req.body.contactemail || '';
    user.business.contactphone = req.body.contactphone || '';
    user.business.social1 = req.body.social1 || '';
    user.business.social2 = req.body.social2 || '';
    user.business.social3 = req.body.social3 || '';
    user.business.social4 = req.body.social4 || '';
    user.business.social5 = req.body.social5 || '';
    user.business.social6 = req.body.social6 || '';
    user.business.social7 = req.body.social7 || '';
    user.business.businesstags = req.body.businesstags || '';
    user.business.postdate = req.body.postdate || '';
    user.business.members = req.body.members || '';
    user.business.weburl = req.body.weburl || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/business');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Business description has been registered.' });
      res.redirect('/account/business');
    });
  });
};

/**
 * POST /account/activity
 * Update activity information.
 */
exports.postUpdateActivity = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/activity');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.activity.name = req.body.name || '';
    user.activity.amount = req.body.amount || '';
    user.activity.source = req.body.source || '';
    user.activity.postdate = req.body.postdate || '';
    user.activity.iphash = req.body.iphash || '';
    user.activity.transhash = req.body.transhash || '';
    user.save((err) => {
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
  });
};


/**
 * GET /account/locsettings
 * Loc items
 */
exports.getLocsettings = (req, res) => {
  res.render('account/locsettings', {
    title: 'Loc Settings'
  });
};

/**
 * POST /account/locsettings
 * Update loc settings.
 */
exports.postUpdateLocsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/locsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.locsettings.user = req.body.user || '';
    user.locsettings.caltitle = req.body.loctitle || '';
    user.locsettings.description = req.body.description || '';
    user.locsettings.loccats = req.body.loccats || '';
    user.locsettings.loctags = req.body.loctags || '';
    user.locsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your loc settings update.' });
          return res.redirect('/account/locsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Loc setings have been updated.' });
      res.redirect('/account/locsettings');
    });
  });
};


/**
 * GET /account/bloghomepage
 *  Specific to blog components
 * Blog homepage content manager
 */
exports.getBloghomepage = (req, res) => {
  res.render('account/bloghomepage', {
    title: 'Blog homepage manager'
  });
};



/**
 * POST /account/bloghomepage
 * Update blog homepage content
 */
exports.postBloghomepage = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/bloghomepage');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.bloghomepage.user = req.body.user || '';
    user.bloghomepage.blogid = req.body.blogid || '';
    user.bloghomepage.element = req.body.element || '';
    user.bloghomepage.title = req.body.title || '';
    user.bloghomepage.author = req.body.author || '';
    user.bloghomepage.pubdate = req.body.pubdate || '';
    user.bloghomepage.weblink1 = req.body.weblink1 || '';
    user.bloghomepage.webline2 = req.body.weblink2 || '';
    user.bloghomepage.webline3 = req.body.weblink3 || '';
    user.bloghomepage.content1 = req.body.content1 || '';
    user.bloghomepage.content2 = req.body.content2 || '';
    user.bloghomepage.status = req.body.status || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your point of sale settings update.' });
          return res.redirect('/account/bloghomepage');
        }
        return next(err);
      }
      req.flash('success', { msg: 'POS setings has been updated.' });
      res.redirect('/account/bloghomepage');
    });
  });
};







/**
 * GET /account/bizsettings
 * Profile page.
 */
exports.getBizsettings = (req, res) => {
  res.render('account/bizsettings', {
    title: 'Business configuration'
  });
};


/**
 * POST /account/bizsettings
 * Update blog settings.
 */
exports.postUpdateBizsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/bizsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.bizsettings.user = req.body.user || '';
    user.bizsettings.biztitle = req.body.biztitle || '';
    user.bizsettings.bizdesc = req.body.bizdesc || '';
    user.bizsettings.shortdesc = req.body.shortdesc || '';
    user.bizsettings.biztags = req.body.biztags || '';
    user.bizsettings.template = req.body.template || '';
    user.bizsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your business configuration update.' });
          return res.redirect('/account/bizsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Business configuration has been updated.' });
      res.redirect('/account/bizsettings');
    });
  });
};



/**
 * GET /account/blogsettings
 * Profile page.
 */
exports.getBlogsettings = (req, res) => {
  res.render('account/blogsettings', {
    title: 'Blog Settings'
  });
};

/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdateBlogsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/blogsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.blogsettings.user = req.body.user || '';
    user.blogsettings.blogtitle = req.body.blogtitle || '';
    user.blogsettings.blogdesc = req.body.blogdesc || '';
    user.blogsettings.shortdesc = req.body.shortdesc || '';
    user.blogsettings.blogtags = req.body.blogtags || '';
    user.blogsettings.template = req.body.template || '';
    user.blogsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your blog settings update.' });
          return res.redirect('/account/blogsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Blog setings has been updated.' });
      res.redirect('/account/blogsettings');
    });
  });
};

/**
*
* Inventory Settings
*
* GET /account/blogsettings
* Profile page.
*/

exports.getInventorysettings = (req, res) => {
  res.render('account/inventorysettings', {
    title: 'Inventory Settings'
  });
};

/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdateInventorysettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/inventorysettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.inventorysettings.user = req.body.user || '';
    user.inventorysettings.invtitle = req.body.invtitle || '';
    user.inventorysettings.shortdesc = req.body.shortdesc || '';
    user.inventorysettings.invdesc = req.body.invdesc || '';
    user.inventorysettings.invtags = req.body.invtags || '';
    user.inventorysettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your Inventory settings update.' });
          return res.redirect('/account/inventorysettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Inventory setings has been updated.' });
      res.redirect('/account/inventorysettings');
    });
  });
};


/**
 * GET /account/group getGroupsettings
 * Group page.
 */
exports.getGroup = (req, res) => {
  res.render('account/group', {
    title: 'Group Details'
  });
};

/**
 * getGroupsettings form
 *
*/

exports.getGroupsettings = (req, res) => {
  res.render('account/groupsettings', {
    title: 'Group Settings'
  });
};

/**
 * getGroupsettings form
 *
*/



/**
 * POST /account/groupsettings
 * Update blog settings.
 */
exports.postUpdateGroupsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/groupsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.groupsettings.groupname = req.body.groupname || '';
    user.groupsettings.adminperson = req.body.adminperson || '';
    user.groupsettings.location = req.body.location || '';
    user.groupsettings.description = req.body.description || '';
    user.groupsettings.shortdesc = req.body.shortdesc || '';
    user.groupsettings.memberlist = req.body.memberlist || '';
    user.groupsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your group details update.' });
          return res.redirect('/account/groupsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Group details have been updated.' });
      res.redirect('/account/groupsettings');
    });
  });
};

exports.getProjectsettings = (req, res) => {
  res.render('account/projectsettings', {
    title: 'Project Settings'
  });
};

/**
 * POST /account/projectsettings
 * Update project settings.
 */
exports.postUpdateProjectsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/projectsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.projectsettings.groupname = req.body.groupname || '';
    user.projectsettings.adminperson = req.body.adminperson || '';
    user.projectsettings.location = req.body.location || '';
    user.projectsettings.description = req.body.description || '';
    user.projectsettings.shortdesc = req.body.shortdesc || '';
    user.projectsettings.memberlist = req.body.memberlist || '';
    user.projectsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your project settings update.' });
          return res.redirect('/account/projectsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Project details have been updated.' });
      res.redirect('/account/projectsettings');
    });
  });
};



exports.getResearchsettings = (req, res) => {
  res.render('account/researchsettings', {
    title: 'Research Settings'
  });
};



/**
 * POST /account/researchsettings
 * Update research settings.
 */
exports.postUpdateResearchsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/researchsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.researchsettings.groupname = req.body.groupname || '';
    user.researchsettings.researchname = req.body.researchname || '';
    user.researchsettings.adminperson = req.body.adminperson || '';
    user.researchsettings.location = req.body.location || '';
    user.researchsettings.description = req.body.description || '';
    user.researchsettings.shortdesc = req.body.shortdesc || '';
    user.researchsettings.memberlist = req.body.memberlist || '';
    user.researchsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your research settings update.' });
          return res.redirect('/account/researchsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Your research settings have been updated.' });
      res.redirect('/account/researchsettings');
    });
  });
};




/**
 * GET /account
 * savings page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Settings'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.email !== req.body.email) user.emailVerified = false;
    user.profile.name = req.body.name || '';
    user.email = req.body.email || '';
    user.paneldriver = req.body.paneldriver || '';
    user.panelsurplus = req.body.panelsurplus || '';
    user.panelwarehouse = req.body.panelwarehouse || '';
    user.panelrequests = req.body.panelrequests || '';
    user.panelresearch = req.body.panelresearch || '';
    user.donations_avail = req.body.donations_avail || '';
    user.item_offered = req.body.item_offered || '';
    user.item_requested = req.body.item_requested || '';
    user.project = req.body.project || '';
    user.blogname = req.body.blogname || '';
    user.group = req.body.group || '';
    user.profile.story = req.body.story || '';
    user.profile.location = req.body.location || '';
    user.profile.business = req.body.business || '';
    user.profile.role = req.body.role || '';
    user.profile.website = req.body.website || '';
    user.profile.vocation = req.body.vocation || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};


/**
 *  userController.getUpdateProfileAjax
 * GET /account/profileajax
 * Update entry based on params in the url string
 */
exports.getUpdateProfileAjax = function (req, res, next) {

    var user = req.params.user;
    var item = req.params.item;
    var val = req.params.val;

    if (item === "need_buildingsupplies") var data = { need_buildingsupplies: val };
    if (item === "need_foodbox") var data = { need_foodbox: val };
    if (item === "need_foodbox") var data = { need_foodbox: val };
    if (item === "need_foodbox1") var data = { need_foodbox1: val };
    if (item === "need_foodbox2to3") var data = { need_foodbox2to3: val };
    if (item === "need_foodbox4to5") var data = { need_foodbox4to5: val };
    if (item === "need_foodbox6to8") var data = { need_foodbox6to8: val };
    if (item === "need_compost") var data = { need_compost: val };
    if (item === "need_compostpickup") var data = { need_compostpickup: val };
    if (item === "need_householditems") var data = { need_householditems: val };
    if (item === "need_tools") var data = { need_tools: val };
    if (item === "need_clothing") var data = { need_clothing: val };
    if (item === "need_books") var data = { need_books: val };
    if (item === "need_plants") var data = { need_plants: val };
    if (item === "need_catfood") var data = { need_catfood: val };
    if (item === "need_dogfood") var data = { need_dogfood: val };
    if (item === "warehouse_vol") var data = { warehouse_vol: val };
    if (item === "surplus") var data = { surplus: val };
    if (item === "pickup_deliver") var data = { pickup_deliver: val };
    if (item === "paneldriver") var data = { paneldriver: val };
    if (item === "panelsurplus") var data = { panelsurplus: val };
    if (item === "panelrequests") var data = { panelrequests: val };
    if (item === "panelwarehouse") var data = { panelwarehouse: val };
    if (item === "panelresearch") var data = { panelresearch: val };
    if (item === "usecase_techinventory") var data = { usecase_techinventory: val };
    if (item === "usecase_foodsecurity") var data = { usecase_foodsecurity: val };
    if (item === "usecase_scdclinic") var data = { usecase_scdclinic: val };
    console.log("hello there. Item id is: " + item + " val: " + val + " user: " + user );

    User.findByIdAndUpdate(user, data, function(err, result) {
    if (err){
         res.send(err);
    }
    else{
         res.status(200);
    };

  });
};


/**
 * POST /account/actionprofile
 * Update profile information.
 */
exports.postUpdateAjaxProfile = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.profile.surplus_provider = req.body.value || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account#profile');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account#profile');
    });
  });
};


/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter((token) =>
      token.kind !== provider.toLowerCase());
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password)
      && tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg: `The ${_.startCase(_.toLower(provider))} account cannot be unlinked without another form of login enabled.`
          + ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${_.startCase(_.toLower(provider))} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  const validationErrors = [];
  if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/forgot');
  }

  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * GET /account/verify/:token
 * Verify email address
 */
exports.getVerifyEmailToken = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    return res.redirect('/account');
  }

  const validationErrors = [];
  if (req.params.token && (!validator.isHexadecimal(req.params.token))) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }

  if (req.params.token === req.user.emailVerificationToken) {
    User
      .findOne({ email: req.user.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'There was an error in loading your profile.' });
          return res.redirect('back');
        }
        user.emailVerificationToken = '';
        user.emailVerified = true;
        user = user.save();
        req.flash('info', { msg: 'Thank you for verifying your email address.' });
        return res.redirect('/account');
      })
      .catch((error) => {
        console.log('Error saving the user profile to the database after email verification', error);
        req.flash('error', { msg: 'There was an error when updating your profile.  Please try again later.' });
        return res.redirect('/account');
      });
  }
};

/**
 * GET /account/verify
 * Verify email address
 */
exports.getVerifyEmail = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    return res.redirect('/account');
  }

  if (!mailChecker.isValid(req.user.email)) {
    req.flash('errors', { msg: 'The email address is invalid or disposable and can not be verified.  Please update your email address and try again.' });
    return res.redirect('/account');
  }

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) => {
    User
      .findOne({ email: req.user.email })
      .then((user) => {
        user.emailVerificationToken = token;
        user = user.save();
      });
    return token;
  };

  const sendVerifyEmail = (token) => {
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: req.user.email,
      from: 'ecocommunity@protonmail.com',
      subject: 'Please verify your email address at Umati Portal',
      text: `Thank you for partipating in the Umatiportal community.\n\n
        This verify your email address please click on the following link, or paste this into your browser:\n\n
        http://${req.headers.host}/account/verify/${token}\n\n
        \n\n
        Thank you!`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${req.user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('info', { msg: `An e-mail has been sent to ${req.user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send verifyEmail email after security downgrade.\n', err);
        req.flash('errors', { msg: 'Error sending the email verification message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendVerifyEmail)
    .then(() => res.redirect('/account'))
    .catch(next);
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirm) validationErrors.push({ msg: 'Passwords do not match' });
  if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Umati Bank password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('success', { msg: 'Success! Your password has been changed.' });
            });
        }
        console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
        req.flash('warning', { msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch((err) => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/forgot');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Umati Bank',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
        req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};
