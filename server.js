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
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
// const multerS3 = require('multer-s3');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
var svgCaptcha = require('svg-captcha-express');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.config({ path: '.env.production' });



/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const blogController = require('./controllers/blog');
const fileController = require('./controllers/file');
const researchController = require('./controllers/research');
const groupdataController = require('./controllers/groupdata');
const projectController = require('./controllers/project');
const inventoryController = require('./controllers/inventory');
const mediaController = require('./controllers/media');
const messagesController = require('./controllers/messages');
const memberController = require('./controllers/member');
const locController = require('./controllers/loc');
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
  resave: false,
  saveUninitialized: true,
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
  if (req.path === '/api/upload') {
    // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
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


app.set('view engine', 'html');
app.get('/map', locController.getLocOpenstreetmap);
app.set('view engine', 'pug');


/**
 * Locally generated captcha  ( less APIs, more privacy )
 *
 */

app.get('/captcha', function (req, res) {
	var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha.data);
});



/**
 * Primary app routes.
 */

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.get('/signupmult', userController.getMultSignup);


// Internal messaging system
app.get('/account/messages', passportConfig.isAuthenticated, messagesController.getMessages);
app.get('/account/inbox', passportConfig.isAuthenticated, messagesController.getInbox);
app.get('/account/compose', passportConfig.isAuthenticated, messagesController.getCompose);

app.get('/account/backup', userController.getBackup);
app.get('/account/backup/csv/:options', userController.getBackupCsv);
app.get('/account/backup/json/:options', userController.getBackupJson);
app.get('/account/exporttocsv', userController.getExportToCsv);
app.get('/account/confirmdelete', userController.getConfirmDelete);
app.get('/signupgroup', userController.getGroupSignup);
app.get('/account/supportedsignup', userController.getSupportedsignup);
app.get('/account/prioritysupport', userController.getPrioritysupport);
app.post('/signup', userController.postSignup);
app.get('/account/createsubgroup', groupdataController.getCreatesubgroupdata);
app.get('/privacypolicy', userController.getPrivacy);
app.get('/privacy', contactController.getPrivacy);
app.get('/contactpage', userController.getContactpage);
app.get('/contact', contactController.getContact);
app.get('/clinic/get-started', contactController.getClinicGetStarted);
app.get('/clinic/get-started2', contactController.getClinicGetStarted2);
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
app.get('/account/signupproposal', passportConfig.isAuthenticated, userController.getProposalSignup);

app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.get('/account/profileajax/:user/:item/:val', passportConfig.isAuthenticated, userController.getUpdateProfileAjax);
app.get('/link/:username', userController.getLink);
app.get('/account/activity', passportConfig.isAuthenticated, userController.getActivity);
app.get('/account/activity-print', passportConfig.isAuthenticated, userController.getActivityprint);
app.post('/account/activity', passportConfig.isAuthenticated, userController.postUpdateActivity);
app.get('/account/setup', passportConfig.isAuthenticated, userController.getSetup);
app.post('/account/setup', passportConfig.isAuthenticated, userController.postUpdateSetup);

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
app.get('/account/researchsettings', passportConfig.isAuthenticated, userController.getResearchsettings);
app.post('/account/researchsettings', passportConfig.isAuthenticated, userController.postUpdateResearchsettings);
app.get('/account/groupsettings', passportConfig.isAuthenticated, userController.getGroupsettings);
app.post('/account/groupsettings', passportConfig.isAuthenticated, userController.postUpdateGroupsettings);
app.get('/account/inventorysettings', passportConfig.isAuthenticated, userController.getInventorysettings);
app.post('/account/inventorysettings', passportConfig.isAuthenticated, userController.postUpdateInventorysettings);

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
app.get('/account/groupadminpanel', passportConfig.isAuthenticated, groupdataController.getGroupAdminPanel);
app.get('/account/group', passportConfig.isAuthenticated, groupdataController.getGroupdata);
app.post('/account/group', passportConfig.isAuthenticated, groupdataController.postGroupdata);
app.get('/account/creategroupnote', passportConfig.isAuthenticated, groupdataController.getCreategroupnote);
app.get('/account/creategroup', passportConfig.isAuthenticated, groupdataController.getCreategroupdata);
app.post('/account/creategroup', passportConfig.isAuthenticated, groupdataController.postCreategroupdata);

app.get('/account/research', passportConfig.isAuthenticated, researchController.getResearch);
app.get('/account/createresearchnote', passportConfig.isAuthenticated, researchController.getCreateresearchnote);
app.post('/account/createresearchnote', passportConfig.isAuthenticated, researchController.postCreateresearchnote);

app.get('/account/blog', passportConfig.isAuthenticated, blogController.getBlog);
app.post('/account/blog', blogController.postUpdateBlog);
app.post('/account/blogupdate', passportConfig.isAuthenticated, blogController.postUpdateBlog);
app.get('/account/blog/:blogpost_id', passportConfig.isAuthenticated, blogController.getUpdateBlogpost);
app.get('/account/site/:blogpost_id', passportConfig.isAuthenticated, blogController.getUpdateSite);
app.get('/blog/:name', blogController.getDisplayPublicBlog);
app.get('/blog/:name/:posttitle', blogController.getDisplayPublicBlogPage);
app.get('/api/css/:name', blogController.getPublicBlogCss);
app.get('/profile/:name', userController.getDisplayPublicProfile);
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


// add bigchaindb api connections here for verification relay
app.get('/account/createmember', passportConfig.isAuthenticated, memberController.getCreatemember);
app.get('/account/payment', passportConfig.isAuthenticated, userController.getMember);
app.post('/account/payment', passportConfig.isAuthenticated, userController.postMember);
app.get('/account/requestpayment', passportConfig.isAuthenticated, userController.getRequestMember);

app.get('/account/jexcel', userController.getJexcel);
app.get('/account/avatared', userController.getAvatared);
app.get('/games/pong', userController.getPong);
app.get('/games/si', userController.getSi);


/**
 * API examples routes.
 */
app.get('/api/umaticast', apiController.getUmaticast);
app.get('/api', apiController.getApi);
app.get('/api/lob', apiController.getLob);
app.get('/api/upload', lusca({ csrf: true }), apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), lusca({ csrf: true }), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.get('/api/google/drive', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleDrive);
app.get('/api/google/sheets', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleSheets);

/**
 * catch all for user pages
 */
app.get('/:name', userController.getPublicUserPage);

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
