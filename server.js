/**
 * Module dependencies.
 */
const express = require('express');
const router = require('express-promise-router')();
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const cloudinary = require('cloudinary');
//const multer = require('multer');
//const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const blogController = require('./controllers/blog');
const groupdataController = require('./controllers/groupdata');
const projectController = require('./controllers/project');
const inventoryController = require('./controllers/inventory');
const calController = require('./controllers/cal');
const mediaController = require('./controllers/media');
const memberController = require('./controllers/member');
const locController = require('./controllers/loc');
const posController = require('./controllers/pos');
const donationController = require('./controllers/donation');
const contactController = require('./controllers/contact');
const apiController = require('./controllers/api');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

app.locals.moment = require('moment');

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
//  if (req.path === '/api/upload') {
//    // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
//    next();
//  } else {
    lusca.csrf()(req, res, next);
 // }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));
app.use('/account/avatars', express.static(path.join(__dirname, 'node_modules/node_modules/avatars-utils/dist'), { maxAge: 31557600000 }));


/**
 * Import routes
 */



/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/homeautomated', homeController.homeautomated);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.get('/signupmult', userController.getMultSignup);
app.get('/account/backup', userController.getBackup);
app.get('/account/confirmdelete', userController.getConfirmDelete);
app.get('/signupgroup', userController.getGroupSignup);
app.get('/account/supportedsignup', userController.getSupportedsignup);
app.get('/account/prioritysupport', userController.getPrioritysupport);
app.post('/signup', userController.postSignup);
app.get('/wardwelcome', userController.getWardwelcome);
app.post('/wardwelcome', userController.postWardwelcome);
app.get('/wardsignup', userController.getWardsignup);
app.get('/wardsignup2', userController.getWardsignup2);
app.post('/wardsignup', userController.postWardsignup);
app.get('/account/createsubgroup', groupdataController.getCreatesubgroupdata);
app.get('/privacypolicy', userController.getPrivacy);
app.get('/privacy', contactController.getPrivacy);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/roadmap', contactController.getRoadmap);

app.get('/account/verify', passportConfig.isAuthenticated, userController.getVerifyEmail);
app.get('/account/verify/:token', passportConfig.isAuthenticated, userController.getVerifyEmailToken);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

app.get('/business/:name', userController.getPublicBusinessPage);
app.get('/group/:name', userController.getPublicGroupPage);
app.get('/project/:name', userController.getPublicProjectPage);
app.get('/account/signupproject', passportConfig.isAuthenticated, userController.getProjectSignup);
app.get('/signupproject', userController.getProjectSignupPublic);
app.get('/account/signupresearch', passportConfig.isAuthenticated, userController.getResearchSignup);
app.get('/signupresearch', userController.getResearchSignupPublic);
app.get('/signupblog', userController.getBlogSignup);
app.get('/account/signupblog', passportConfig.isAuthenticated, userController.getBlogSignup);

app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.get('/account/profileajax/:user/:item/:val', passportConfig.isAuthenticated, userController.getUpdateProfileAjax);
app.get('/link/:username', userController.getLink);
app.get('/account/activity', passportConfig.isAuthenticated, userController.getActivity);
app.get('/account/activity-print', passportConfig.isAuthenticated, userController.getActivityprint);
app.post('/account/activity', passportConfig.isAuthenticated, userController.postUpdateActivity);
app.get('/account/setup', passportConfig.isAuthenticated, userController.getSetup);
app.post('/account/setup', passportConfig.isAuthenticated, userController.postUpdateSetup);
app.get('/account/messages', passportConfig.isAuthenticated, userController.getMessages);
app.get('/account/messagessent', passportConfig.isAuthenticated, userController.getMessagesSent);
app.get('/account/messagesdrafts', passportConfig.isAuthenticated, userController.getMessagesDrafts);
app.get('/account/messagesinspiration', passportConfig.isAuthenticated, userController.getMessagesInspiration);
app.get('/account/messagesbusiness', passportConfig.isAuthenticated, userController.getMessagesBusiness);
app.get('/account/messagestags', passportConfig.isAuthenticated, userController.getMessagesTags);
app.get('/account/messagesimportant', passportConfig.isAuthenticated, userController.getMessagesImportant);
app.get('/account/messagesgroupinspiration', passportConfig.isAuthenticated, userController.getMessagesGroupInspiration);
app.get('/account/messagesgroupbusiness', passportConfig.isAuthenticated, userController.getMessagesGroupBusiness);
app.get('/account/messagesgroupimportant', passportConfig.isAuthenticated, userController.getMessagesGroupImportant);

app.get('/account/messagestrashremove/:itemid', passportConfig.isAuthenticated, userController.getMessagesTrashRemove);
app.get('/account/messagestrashmoveajax/:itemid/:status/', passportConfig.isAuthenticated, userController.getMessagesTrashMoveAjax);
//app.get('/account/messagestrashmove/:messageid', passportConfig.isAuthenticated, userController.getMessagesTrashMove);
app.get('/account/messagestrash/:messageid', passportConfig.isAuthenticated, userController.getMessagesTrash);
app.get('/account/messagestrash', passportConfig.isAuthenticated, userController.getMessagesTrashlist);
app.get('/account/messagecompose', passportConfig.isAuthenticated, userController.getMessageCompose);
app.post('/account/messagecreate', passportConfig.isAuthenticated, userController.postMessageCreate);
app.get('/account/business', passportConfig.isAuthenticated, userController.getBusiness);
app.post('/account/business', passportConfig.isAuthenticated, userController.postUpdateBusiness);
app.get('/account/bizsettings', passportConfig.isAuthenticated, userController.getBizsettings);
app.post('/account/bizsettings', passportConfig.isAuthenticated, userController.postUpdateBizsettings);
app.get('/account/locsettings', passportConfig.isAuthenticated, userController.getLocsettings);
app.post('/account/locsettings', passportConfig.isAuthenticated, userController.postUpdateLocsettings);
app.get('/account/blogsettings', passportConfig.isAuthenticated, userController.getBlogsettings);
app.post('/account/bloghomepage', passportConfig.isAuthenticated, userController.postBloghomepage);
app.get('/account/bloghomepage', passportConfig.isAuthenticated, userController.getBloghomepage);
app.post('/account/blogsettings', passportConfig.isAuthenticated, userController.postUpdateBlogsettings);
app.get('/account/projectsettings', passportConfig.isAuthenticated, userController.getProjectsettings);
app.post('/account/projectsettings', passportConfig.isAuthenticated, userController.postUpdateProjectsettings);
app.get('/account/groupsettings', passportConfig.isAuthenticated, userController.getGroupsettings);
app.post('/account/groupsettings', passportConfig.isAuthenticated, userController.postUpdateGroupsettings);
app.get('/account/inventorysettings', passportConfig.isAuthenticated, userController.getInventorysettings);
app.post('/account/inventorysettings', passportConfig.isAuthenticated, userController.postUpdateInventorysettings);
app.get('/account/calsettings', passportConfig.isAuthenticated, userController.getCalsettings);
app.post('/account/calsettings', passportConfig.isAuthenticated, userController.postUpdateCalsettings);
app.get('/account/possettings', passportConfig.isAuthenticated, userController.getPossettings);
app.post('/account/possettings', passportConfig.isAuthenticated, userController.postUpdatePossettings);

app.get('/projects', userController.getProjects);
app.get('/account/projectdata', passportConfig.isAuthenticated, projectController.getProjectdata);
app.get('/account/project', passportConfig.isAuthenticated, projectController.getProjectdata);
app.post('/account/project', passportConfig.isAuthenticated, projectController.postProjectdata);

app.get('/account/createproject', passportConfig.isAuthenticated, projectController.getCreateprojectdata);
app.post('/account/createproject', passportConfig.isAuthenticated, projectController.postCreateprojectdata);

app.get('/account/createprojectnote', passportConfig.isAuthenticated, projectController.getCreateprojectnote);
app.post('/account/createprojectnote', passportConfig.isAuthenticated, projectController.postCreateprojectnote);

app.get('/account/createsubproject', passportConfig.isAuthenticated, projectController.getCreateprojectdata);
app.post('/account/createproject', passportConfig.isAuthenticated, projectController.postCreateprojectdata);

app.get('/account/groupdatasheet1', passportConfig.isAuthenticated, groupdataController.getGroupdatasheet1);
app.get('/account/group', passportConfig.isAuthenticated, groupdataController.getGroupdata);
app.post('/account/group', passportConfig.isAuthenticated, groupdataController.postGroupdata);
app.get('/account/creategroupnote', passportConfig.isAuthenticated, groupdataController.getCreategroupnote);
app.get('/account/creategroup', passportConfig.isAuthenticated, groupdataController.getCreategroupdata);
app.post('/account/creategroup', passportConfig.isAuthenticated, groupdataController.postCreategroupdata);

app.get('/account/research', passportConfig.isAuthenticated, blogController.getBlog);

app.get('/account/editor', passportConfig.isAuthenticated, blogController.getEditor);
app.get('/account/blog', passportConfig.isAuthenticated, blogController.getBlog);
app.get('/blog', blogController.getPublicBlog);
app.post('/account/blog', blogController.postUpdateBlog);
app.post('/account/blogupdate', passportConfig.isAuthenticated, blogController.postUpdateBlog);
app.get('/account/blog/:blogpost_id', passportConfig.isAuthenticated, blogController.getUpdateBlogpost);
app.get('/blog/:blogpost_id', blogController.getDisplayBlogpost);
app.get('/profile/:username', userController.getDisplayPublicProfile);
app.get('/account/createloc', passportConfig.isAuthenticated, locController.getCreateloc);
app.post('/account/createloc', passportConfig.isAuthenticated, locController.postCreateloc);

app.get('/account/loc', passportConfig.isAuthenticated, locController.getLoc);
app.get('/account/location', passportConfig.isAuthenticated, locController.getLocation);
app.post('/account/loc', locController.postUpdateLoc);
app.post('/account/locupdate', passportConfig.isAuthenticated, blogController.postUpdateBlog);
app.get('/account/loc/:locpost_id', passportConfig.isAuthenticated, locController.getUpdateLocpost);
app.get('/account/createloc', passportConfig.isAuthenticated, locController.getCreateloc);
app.get('/account/createpost', passportConfig.isAuthenticated, blogController.getCreatepost);
app.post('/account/createpost', passportConfig.isAuthenticated, blogController.postCreatepost);
app.get('/account/inventory/:inventoryid', passportConfig.isAuthenticated, inventoryController.getUpdateInventory);
app.get('/account/inventory', passportConfig.isAuthenticated, inventoryController.getInventory);
app.post('/account/inventory', passportConfig.isAuthenticated, inventoryController.postUpdateInventory);
app.get('/account/createinventory', passportConfig.isAuthenticated, inventoryController.getCreateinventory);
app.post('/account/createinventory', passportConfig.isAuthenticated, inventoryController.postCreateinventory);
app.post('/account/inventoryedit', passportConfig.isAuthenticated, inventoryController.postUpdateInventory);
app.get('/account/driver', passportConfig.isAuthenticated, donationController.getDriver);
app.get('/account/surplus_provider', passportConfig.isAuthenticated, donationController.getSurplusprovider);
app.get('/account/requests', passportConfig.isAuthenticated, donationController.getRequests);
app.get('/account/warehouse', passportConfig.isAuthenticated, donationController.getWarehouse);
app.get('/account/ops', passportConfig.isAuthenticated, donationController.getOps);
app.get('/account/donation', passportConfig.isAuthenticated, inventoryController.getDonation);
app.get('/account/createdonation', passportConfig.isAuthenticated, inventoryController.getCreatedonation);
app.post('/account/createdonation', passportConfig.isAuthenticated, inventoryController.postCreatedonation);
app.get('/account/donation/:donation_id', passportConfig.isAuthenticated, inventoryController.getUpdateDonation);
app.post('/account/donationedit', passportConfig.isAuthenticated, inventoryController.postUpdateDonation);
app.get('/account/api/cal', passportConfig.isAuthenticated, calController.getCaljson);
app.get('/account/cal', passportConfig.isAuthenticated, calController.getCal);

app.post('/account/cal', passportConfig.isAuthenticated, calController.postCreateCalEntry);
app.get('/account/cal/:calitem_id', passportConfig.isAuthenticated, calController.getUpdateCalEntry);
app.post('/account/calentryupdate', passportConfig.isAuthenticated, calController.postUpdateCalEntry);
app.get('/account/calentrycreate', passportConfig.isAuthenticated, calController.getCalEntry);
app.post('/account/calentrycreate', passportConfig.isAuthenticated, calController.postCreateCalEntry);

app.post('/account/pos', passportConfig.isAuthenticated, posController.postUpdatePosEntry);
app.get('/account/pos', passportConfig.isAuthenticated, posController.getPos);
app.get('/account/pos/:posid', passportConfig.isAuthenticated, posController.getUpdatePosEntry);
app.get('/account/posentrycreate', passportConfig.isAuthenticated, posController.getPosEntry);
app.post('/account/posentrycreate', passportConfig.isAuthenticated, posController.postCreatePosEntry);
app.post('/account/posentryedit', passportConfig.isAuthenticated, posController.postUpdatePosEntry);

// add bigchaindb api connections here for verification relay
app.get('/account/createmember', passportConfig.isAuthenticated, memberController.getCreatemember);
app.get('/account/payment', passportConfig.isAuthenticated, userController.getMember);
app.post('/account/payment', passportConfig.isAuthenticated, userController.postMember);
app.get('/account/requestpayment', passportConfig.isAuthenticated, userController.getRequestMember);

app.post('/account/upload', passportConfig.isAuthenticated, blogController.postUpload);

app.get('/account/jexcel', userController.getJexcel);
app.get('/account/avatared', userController.getAvatared);
app.get('/games/pong', userController.getPong);
app.get('/games/si', userController.getSi);

app.get('/:name', userController.getPublicUserPage);

/**
 * API examples routes.
 */
app.get('/api/umaticast', apiController.getUmaticast);
//app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
//app.get('/api/upload', lusca({ csrf: true }), apiController.getFileUpload);
//app.post('/api/upload', upload.single('myFile'), lusca({ csrf: true }), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.get('/api/here-maps', apiController.getHereMaps);
app.get('/api/google-maps', apiController.getGoogleMaps);
app.get('/api/google/drive', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleDrive);
app.get('/api/chart', apiController.getChart);
app.get('/api/google/sheets', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleSheets);
app.get('/api/quickbooks', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getQuickbooks);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram', { scope: ['basic', 'public_content'] }));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/snapchat', passport.authenticate('snapchat'));
app.get('/auth/snapchat/callback', passport.authenticate('snapchat', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/api' }), (req, res) => {
  res.redirect(req.session.returnTo);
});
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});
app.get('/auth/quickbooks', passport.authorize('quickbooks', { scope: ['com.intuit.quickbooks.accounting'], state: 'SOME STATE' }));
app.get('/auth/quickbooks/callback', passport.authorize('quickbooks', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo);
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓✓✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
