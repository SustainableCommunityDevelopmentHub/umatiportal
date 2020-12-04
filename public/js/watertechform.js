var _class, _temp, _class2, _temp2, _class3, _temp3, _class4, _temp4, _class5, _temp5, _class6, _temp6, _class7, _temp7, _class8, _temp8, _class9, _temp9, _class10, _temp10, _class11, _temp11;function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {if (window.CP.shouldStopExecution(1)) break;var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}window.CP.exitedLoop(1);return target;};return _extends.apply(this, arguments);}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               3rd PARTY LIBRARY IMPORTS - all the external libraries being used
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               HOOKS - route on-enter callbacks, useful for running code before a page loads
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ROUTES - routing config that glues url routes to pages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               REDUX CONFIG - configures the store with reducers, adds middlewares, etc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               NAVIGATION CONSTANTS - these are the page names, used for navigating routes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               REDUCERS - typical redux reducers, keeps track of data multiple components will use
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               CONSTANTS - simple strings that are used as action event keys in reducers, actions and sagas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               SAGAS - a place for side-effects to happen, very good for testing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               GENERIC STORE-CONNECTED COMPONENTS - react components that are connected to the store
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               SUBMISSIONS - these combine form submissions with action calls, providing extra info that the form shouldn't know
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ACTIONS - simple object creators that are used by the reducers and sagas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               PAGES, ROUTE-SPECIFIC STORE-CONNECTED COMPONENTS - these are connected to routes, 1-to-1 pairing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               UTILS/ROUTES - helper functions to deal with routing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               UTILS/FORMS - helpers functions to deal with forms
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FORM VALIDATIONS - these simple functions check form values to report missing value errors
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FORMS - redux-form-connected components that simply assemble fields the form will use
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FORM FIELDS - simple components that wrap generic controls and make them specific to the form that uses them
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FORM FIELD CONTROLS - generic user input controls, they are adapted to forms by being wrapped in fields
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               SELECTORS - functions to extract data from the stores, keeps components decoupled from the store's implementation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

// BEGIN 3rd PARTY LIBRARY IMPORTS
const {
  select,
  call,
  takeEvery } =
ReduxSaga.effects;
const {
  Provider,
  connect } =
ReactRedux;
const {
  routerMiddleware,
  routerReducer,
  syncHistoryWithStore } =
ReactRouterRedux;
const {
  Field,
  FieldArray,
  Fields,
  FormSection,
  reduxForm } =
ReduxForm;
const {
  IndexRedirect,
  Link,
  Route,
  Router,
  hashHistory } =
ReactRouter;
const sagaMiddleware = ReduxSaga.default();
const DropzoneComponent = Dropzone;
// END 3rd PARTY LIBRARY IMPORTS

// BEGIN HOOKS
const updateParamsHook = store => (nextState, replace, next) => {
  store.dispatch(updateParamsAction(nextState.params));
  next();
};

const ensureContactDetails = store => (nextState, replace, next) => {
  if (getIsContactDetailsComplete(store.getState()) === false) {
    replace(`/${CONTACT_PAGE}`);
  }
  next();
};
// END HOOKS

// BEGIN ROUTES
setTimeout(() => {
  const store = configureStore();
  const history = syncHistoryWithStore(hashHistory, store);
  ReactDOM.render(
  React.createElement(Provider, { store },
  React.createElement(Router, { history },
  React.createElement(Route, {
    component: AppContainer,
    path: "/" },
  React.createElement(Route, {
    path: CONTACT_PAGE,
    component: ContactPage,
    wizardProgress: "0" }),

  React.createElement(Route, {
    path: PROFESSION_PAGE,
    onEnter: composeEnterHooksSeries(ensureContactDetails(store)),
    component: ProfessionPage,
    wizardProgress: "1" }),

  React.createElement(Route, {
    path: `:profession/${SPECIALIZATION_PAGE}`,
    onEnter: composeEnterHooksSeries(ensureContactDetails(store), updateParamsHook(store)),
    component: SpecializationPage,
    wizardProgress: "2" }),

  React.createElement(Route, {
    path: `:profession/:specialization/${ROLE_PAGE}`,
    onEnter: composeEnterHooksSeries(ensureContactDetails(store), updateParamsHook(store)),
    component: RolePage,
    wizardProgress: "3" }),

  React.createElement(Route, {
    path: `:profession/:specialization/:role/${CONCENTRATION_PAGE}`,
    onEnter: composeEnterHooksSeries(ensureContactDetails(store), updateParamsHook(store)),
    component: ConcentrationPage,
    wizardProgress: "4" }),

  React.createElement(Route, {
    path: `:profession/:specialization/:role/:concentration/${FILE_UPLOAD_PAGE}`,
    onEnter: composeEnterHooksSeries(ensureContactDetails(store), updateParamsHook(store)),
    component: FileUploadPage,
    wizardProgress: "5" }),

  React.createElement(Route, {
    path: SUCCESS_PAGE,
    component: SuccessPage,
    wizardProgress: "6" }),

  React.createElement(IndexRedirect, { to: LANDING_PAGE })))),



  document.getElementById('js-app'));
}, 0);
// END ROUTES

// BEGIN REDUX CONFIG
function configureStore(initialState) {
  const reducers = Redux.combineReducers({
    ui: uiReducer,
    jobApplications: jobApplicationsReducer,
    form: ReduxForm.reducer,
    routing: routerReducer });

  const router = routerMiddleware(hashHistory);
  const store = Redux.createStore(
  reducers,
  initialState,
  Redux.applyMiddleware(router, sagaMiddleware));

  sagaMiddleware.run(rootSaga);
  return store;
}
// END REDUX CONFIG

// BEGIN NAVIGATION CONSTANTS
const CONTACT_PAGE = 'contact';
const PROFESSION_PAGE = 'profession';
const SPECIALIZATION_PAGE = 'specialization';
const ROLE_PAGE = 'role';
const CONCENTRATION_PAGE = 'concentration';
const FILE_UPLOAD_PAGE = 'file-upload';
const SUCCESS_PAGE = 'success';
const LANDING_PAGE = CONTACT_PAGE;
// END NAVIGATION CONSTANTS

// BEGIN REDUCERS
const getUiDefaultState = () => ({
  params: {} });


const uiReducer = (state = getUiDefaultState(), action) => {
  if (action.type === UPDATE_PARAMS) {
    return {
      ...state,
      params: {
        ...state.params,
        ...action.params } };


  }
  return state;
};

const getContactDetailsDefaultState = () => ({
  username: null });


const jobApplicationsReducer = (state = getContactDetailsDefaultState(), action) => {
  if (action.type === SUBMIT_CONTACT_DETAILS) {
    return {
      ...state,
      username: action.username };

  }
  return state;
};
// END REDUCERS

// BEGIN CONSTANTS
const UPDATE_PARAMS = 'ui/updateParams';
const SUBMIT_CONTACT_DETAILS = 'jobApplication/contactDetails/submit';
const SUBMIT_PROFESSION = 'jobApplication/profession/submit';
const SUBMIT_SPECIALIZATION = 'jobApplication/specialization/submit';
const SUBMIT_ROLE = 'jobApplication/role/submit';
const SUBMIT_CONCENTRATION = 'jobApplication/concentration/submit';
const SUBMIT_FILE_UPLOAD = 'jobApplication/fileUpload/submit';
// END CONSTANTS

// BEGIN SAGAS
function* rootSaga() {
  yield ReduxSaga.effects.all([
  contactDetailsSubmitSaga(),
  professionSubmitSaga(),
  specializationSubmitSaga(),
  roleSubmitSaga(),
  concentrationSubmitSaga(),
  fileUploadSubmitSaga()]);

}

function* fileUploadSubmitSaga() {
  yield takeEvery(SUBMIT_FILE_UPLOAD, fileUploadSubmitEffect);
}

function* fileUploadSubmitEffect(action) {
  yield call(action.form.resolve);
  const username = yield select(getUsername);
  const profession = yield select(getParamsProfession);
  const specialization = yield select(getParamsSpecialization);
  const role = yield select(getParamsRole);
  const concentration = yield select(getParamsConcentration);
  const files = action.files;
  yield call(console.log, 'successful job app submit!', {
    username,
    profession,
    specialization,
    role,
    concentration,
    files });

  yield call(hashHistory.push, `/${SUCCESS_PAGE}`);
}

function* concentrationSubmitSaga() {
  yield takeEvery(SUBMIT_CONCENTRATION, concentrationSubmitEffect);
}

function* concentrationSubmitEffect(action) {
  yield call(action.form.resolve);
  const profession = yield select(getParamsProfession);
  const specialization = yield select(getParamsSpecialization);
  const role = yield select(getParamsRole);
  yield call(hashHistory.push, `/${profession}/${specialization}/${role}/${action.concentration}/${FILE_UPLOAD_PAGE}`);
}

function* roleSubmitSaga() {
  yield takeEvery(SUBMIT_ROLE, roleSubmitEffect);
}

function* roleSubmitEffect(action) {
  yield call(action.form.resolve);
  const profession = yield select(getParamsProfession);
  const specialization = yield select(getParamsSpecialization);
  yield call(hashHistory.push, `/${profession}/${specialization}/${action.role}/${CONCENTRATION_PAGE}`);
}

function* specializationSubmitSaga() {
  yield takeEvery(SUBMIT_SPECIALIZATION, specializationSubmitEffect);
}

function* specializationSubmitEffect(action) {
  yield call(action.form.resolve);
  const profession = yield select(getParamsProfession);
  yield call(hashHistory.push, `/${profession}/${action.specialization}/${ROLE_PAGE}`);
}

function* professionSubmitSaga() {
  yield takeEvery(SUBMIT_PROFESSION, professionSubmitEffect);
}

function* professionSubmitEffect(action) {
  yield call(action.form.resolve);
  yield call(hashHistory.push, `/${action.profession}/${SPECIALIZATION_PAGE}`);
}

function* contactDetailsSubmitSaga() {
  yield takeEvery(SUBMIT_CONTACT_DETAILS, contactDetailsSubmitEffect);
}

function* contactDetailsSubmitEffect(action) {
  yield call(action.form.resolve);
  yield call(hashHistory.push, `/${PROFESSION_PAGE}`);
}
// END SAGAS

// BEGIN GENERIC STORE-CONNECTED COMPONENTS
const AppContainer = connect((state, ownProps) => ({
  pages: getProgressPages(state, ownProps) }),
{})(
class extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "o-wrapper" },
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item" },
      React.createElement("ul", { className: "o-list-bare o-list-inline c-form-progress" },
      this.props.pages.map((page, index) =>
      React.createElement("li", {
        key: index,
        className: classNames({
          'o-list-inline__item': true,
          'c-form-progress__item': true,
          'c-form-progress__item--complete': page.complete,
          'c-form-progress__item--active': page.active }) },

      page.label))))),




      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item" },
      this.props.children))));




  }});

// END GENERIC STORE-CONNECTED COMPONENTS

// BEGIN FORM SUBMISSIONS
const fileUploadSubmission = callbackAction => {
  return values => {
    const {
      fileUpload } =
    values;
    return new Promise((resolve, reject) => {
      callbackAction(fileUpload.files, resolve, reject);
    });
  };
};

const contactDetailsSubmission = callbackAction => {
  return ({ contact }) => {
    return new Promise((resolve, reject) => {
      callbackAction(contact.username, resolve, reject);
    });
  };
};

const professionSubmission = callbackAction => {
  return ({ profession }) => {
    return new Promise((resolve, reject) => {
      callbackAction(profession.title, resolve, reject);
    });
  };
};

const specializationSubmission = callbackAction => {
  return ({ specialization }) => {
    return new Promise((resolve, reject) => {
      callbackAction(specialization.title, resolve, reject);
    });
  };
};

const roleSubmission = callbackAction => {
  return ({ role }) => {
    return new Promise((resolve, reject) => {
      callbackAction(role.title, resolve, reject);
    });
  };
};

const concentrationSubmission = callbackAction => {
  return ({ concentration }) => {
    return new Promise((resolve, reject) => {
      callbackAction(concentration.title, resolve, reject);
    });
  };
};
// END FORM SUBMISSIONS

// BEGIN ACTIONS
const updateParamsAction = params => ({
  type: UPDATE_PARAMS,
  params });


const submitContactDetailsAction = (username, resolve, reject) => ({
  type: SUBMIT_CONTACT_DETAILS,
  username,
  form: {
    resolve,
    reject } });



const submitProfessionAction = (profession, resolve, reject) => ({
  type: SUBMIT_PROFESSION,
  profession,
  form: {
    resolve,
    reject } });



const submitSpecializationAction = (specialization, resolve, reject) => ({
  type: SUBMIT_SPECIALIZATION,
  specialization,
  form: {
    resolve,
    reject } });



const submitRoleAction = (role, resolve, reject) => ({
  type: SUBMIT_ROLE,
  role,
  form: {
    resolve,
    reject } });



const submitFileUploadAction = (files, resolve, reject) => ({
  type: SUBMIT_FILE_UPLOAD,
  files,
  form: {
    resolve,
    reject } });



const submitConcentrationAction = (concentration, resolve, reject) => ({
  type: SUBMIT_CONCENTRATION,
  concentration,
  form: {
    resolve,
    reject } });


// END ACTIONS

// BEGIN PAGES, ROUTE-SPECIFIC STORE-CONNECTED COMPONENTS
const ContactPage = connect(() => ({}),
{
  submitContactDetails: submitContactDetailsAction })((_temp = _class =
class extends React.Component {




  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Contact Details'),
      React.createElement("p", null, 'Please provide your contact details.'),
      React.createElement(ContactDetailsForm, { onSubmit: contactDetailsSubmission(this.props.submitContactDetails) }))));



  }}, _defineProperty(_class, "propTypes", { submitContactDetails: PropTypes.func.isRequired }), _temp));


const ProfessionPage = connect((state, ownProps) => ({
  professionOptions: getProfessionOptions(state, ownProps) }),
{
  submitProfession: submitProfessionAction })((_temp2 = _class2 =
class extends React.Component {




  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Profession Page'),
      React.createElement("p", null, 'Pick your profession'),
      React.createElement(ProfessionForm, {
        onSubmit: professionSubmission(this.props.submitProfession),
        professionOptions: this.props.professionOptions }))));




  }}, _defineProperty(_class2, "propTypes", { submitProfession: PropTypes.func.isRequired }), _temp2));


const SpecializationPage = connect((state, ownProps) => ({
  specializationOptions: getSpecializationOptions(state, ownProps) }),
{
  submitSpecialization: submitSpecializationAction })((_temp3 = _class3 =
class extends React.Component {








  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Specialization Page'),
      React.createElement("p", null, 'Choose a specialization'),
      React.createElement(SpecializationForm, {
        specializationOptions: this.props.specializationOptions,
        onSubmit: specializationSubmission(this.props.submitSpecialization) }))));




  }}, _defineProperty(_class3, "propTypes", { submitSpecialization: PropTypes.func.isRequired, specializationOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp3));


const RolePage = connect((state, ownProps) => ({
  roleOptions: getRoleOptions(state, ownProps) }),
{
  submitRole: submitRoleAction })((_temp4 = _class4 =
class extends React.Component {








  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Role Page'),
      React.createElement("p", null, 'What role would you like?'),
      React.createElement(RoleForm, {
        roleOptions: this.props.roleOptions,
        onSubmit: roleSubmission(this.props.submitRole) }))));




  }}, _defineProperty(_class4, "propTypes", { submitRole: PropTypes.func.isRequired, roleOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp4));


const ConcentrationPage = connect((state, ownProps) => ({
  concentrationOptions: getConcentrationOptions(state, ownProps) }),
{
  submitConcentration: submitConcentrationAction })((_temp5 = _class5 =
class extends React.Component {








  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Concentration Page'),
      React.createElement("p", null, 'How about a specific concentration?'),
      React.createElement(ConcentrationForm, {
        concentrationOptions: this.props.concentrationOptions,
        onSubmit: concentrationSubmission(this.props.submitConcentration) }))));




  }}, _defineProperty(_class5, "propTypes", { submitConcentration: PropTypes.func.isRequired, concentrationOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp5));


const FileUploadPage = connect((state, ownProps) => ({}),
{
  submitFileUpload: submitFileUploadAction })((_temp6 = _class6 =
class extends React.Component {




  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'File Upload Page'),
      React.createElement("p", null, 'Attach some files for this application.'),
      React.createElement(FileUploadForm, { onSubmit: fileUploadSubmission(this.props.submitFileUpload) }))));



  }}, _defineProperty(_class6, "propTypes", { submitFileUpload: PropTypes.func.isRequired }), _temp6));


const SuccessPage = connect(() => ({}),
{})(
class extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "o-layout" },
      React.createElement("div", { className: "o-layout__item u-1/2@tablet" },
      React.createElement("h1", null, 'Success Page'),
      React.createElement("p", null, 'You successfully completed the form!'))));



  }});

// END PAGES, ROUTE-SPECIFIC STORE-CONNECTED COMPONENTS

// BEGIN UTILS/ROUTES
const composeEnterHooksSeries = (...hooks) => {
  return (nextState, originalReplace, executeTransition) => {
    let cancelSeries = false;
    const replace = location => {
      cancelSeries = true;
      originalReplace(location);
    };
    (function executeHooksSynchronously(remainingHooks) {
      if (cancelSeries || !remainingHooks.length) {
        return executeTransition();
      }
      let nextHook = remainingHooks[0];
      if (nextHook.length >= 3) {
        nextHook.call(this, nextState, replace, () => {
          executeHooksSynchronously(remainingHooks.slice(1));
        });
      } else {
        nextHook.call(this, nextState, replace);
        executeHooksSynchronously(remainingHooks.slice(1));
      }
    })(hooks);
  };
};
// END UTILS/ROUTES

// BEGIN UTILS/FORMS
const validateFields = (validators, requiredFields = {}) => values => {
  const validationErrors = Object.keys(validators).map(name => ({
    name,
    error: validators[name](values[name]) })).
  reduce((p, { name, error }) =>
  Object.keys(name).length ? { ...p, [name]: error } : p,
  {});
  Object.keys(requiredFields).forEach(fieldName => {
    Object.assign(validationErrors[fieldName], requiredFields[fieldName](values[fieldName]));
  });
  return validationErrors;
};
// END UTILS/FORMS

// BEGIN FORM VALIDATIONS
const usernameValidation = values => {
  const errors = {};
  if (!values || !values.username) {
    errors.username = 'Required';
  }
  return errors;
};

const titleValidation = values => {
  const errors = {};
  if (!values || !values.title) {
    errors.title = 'Required';
  }
  return errors;
};

const contactValidation = values => ({
  ...usernameValidation(values) });


const professionValidation = values => ({
  ...titleValidation(values) });


const specializationValidation = values => ({
  ...titleValidation(values) });


const roleValidation = values => ({
  ...titleValidation(values) });


const concentrationValidation = values => ({
  ...titleValidation(values) });


const filesValidation = values => {
  const errors = {};
  if (!values || !values.files) {
    errors.files = {
      _error: 'Required' };

  }
  return errors;
};

const fileUploadValidation = values => ({
  ...filesValidation(values) });

// END FORM VALIDATIONS

// BEGIN FORMS
const ContactDetailsForm = reduxForm({
  form: 'contentDetails',
  validate: validateFields({
    contact: contactValidation }) })(

class extends React.Component {
  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "contact" },
      React.createElement(UsernameField, null)),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }});


const ProfessionForm = reduxForm({
  form: 'profession',
  validate: validateFields({
    profession: professionValidation }) })((_temp7 = _class7 =

class extends React.Component {







  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "profession" },
      React.createElement(ProfessionTitleField, { options: this.props.professionOptions })),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }}, _defineProperty(_class7, "propTypes", { professionOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp7));


const SpecializationForm = reduxForm({
  form: 'specialization',
  validate: validateFields({
    specialization: specializationValidation }) })((_temp8 = _class8 =

class extends React.Component {







  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "specialization" },
      React.createElement(SpecializationTitleField, { options: this.props.specializationOptions })),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }}, _defineProperty(_class8, "propTypes", { specializationOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp8));


const RoleForm = reduxForm({
  form: 'role',
  validate: validateFields({
    role: roleValidation }) })((_temp9 = _class9 =

class extends React.Component {







  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "role" },
      React.createElement(RoleTitleField, { options: this.props.roleOptions })),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }}, _defineProperty(_class9, "propTypes", { roleOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp9));


const ConcentrationForm = reduxForm({
  form: 'concentration',
  validate: validateFields({
    concentration: concentrationValidation }) })((_temp10 = _class10 =

class extends React.Component {







  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "concentration" },
      React.createElement(ConcentrationTitleField, { options: this.props.concentrationOptions })),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }}, _defineProperty(_class10, "propTypes", { concentrationOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired }), _temp10));


const FileUploadForm = reduxForm({
  form: 'fileUpload',
  validate: validateFields({
    fileUpload: fileUploadValidation }) })((_temp11 = _class11 =

class extends React.Component {



  render() {
    return (
      React.createElement("form", { onSubmit: this.props.handleSubmit },
      React.createElement(FormSection, { name: "fileUpload" },
      React.createElement(FileUploadField, null)),

      React.createElement(SubmitButton, { disabled: this.props.submitting })));


  }}, _defineProperty(_class11, "propTypes", {}), _temp11));

// END FORMS

// BEGIN FORM FIELDS
class SubmitButton extends React.Component {
  render() {
    return (
      React.createElement("button", {
        disabled: this.props.disabled,
        className: "c-form-button c-form-button--primary c-form-button--block",
        type: "submit" },
      'Submit'));

  }}


class FileFields extends React.Component {
  render() {
    return (
      React.createElement("ul", null,
      React.createElement("li", null,
      React.createElement(DropzoneComponent, {
        onDrop: files => {
          this.props.fields.map((_, i) => ths.props.fields.remove(i));
          files.map(file => this.props.fields.push(file));
        } },
      'Drop files here')),

      this.props.meta.error &&
      React.createElement("li", { className: "u-red" }, this.props.meta.error),

      this.props.fields.map((file, index) =>
      React.createElement("li", { key: index },
      React.createElement("button", {
        onClick: () => this.props.fields.remove(index),
        type: "button" },
      'X'),
      React.createElement(Field, {
        name: `${file}.name`,
        component: TextDisplayControl })))));





  }}


class FileUploadField extends React.Component {
  render() {
    return (
      React.createElement(FieldArray, {
        name: "files",
        component: FileFields,
        label: "Upload files" }));


  }}


class UsernameField extends React.Component {
  render() {
    return (
      React.createElement(FormField, {
        icon: "Password",
        fields: [
        {
          name: 'username',
          placeholder: 'Username',
          type: 'text' }] }));




  }}


class ConcentrationTitleField extends React.Component {







  render() {
    return (
      React.createElement(Field, {
        component: RadioControl,
        hint: "Pick a concentration",
        label: "Concentration",
        name: "title",
        options: this.props.options.map(o => ({
          ...o,
          classes: 'u-1/3',
          icon: 'Password' })) }));



  }}_defineProperty(ConcentrationTitleField, "propTypes", { options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired });


class RoleTitleField extends React.Component {







  render() {
    return (
      React.createElement(Field, {
        component: RadioControl,
        hint: "Pick a role",
        label: "Role",
        name: "title",
        options: this.props.options.map(o => ({
          ...o,
          classes: 'u-1/3',
          icon: 'Password' })) }));



  }}_defineProperty(RoleTitleField, "propTypes", { options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired });


class SpecializationTitleField extends React.Component {







  render() {
    return (
      React.createElement(Field, {
        component: RadioControl,
        hint: "Pick a specialization",
        label: "Specialization",
        name: "title",
        options: this.props.options.map(o => ({
          ...o,
          classes: 'u-1/3',
          icon: 'Password' })) }));



  }}_defineProperty(SpecializationTitleField, "propTypes", { options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired });


class ProfessionTitleField extends React.Component {







  render() {
    return (
      React.createElement(Field, {
        component: RadioControl,
        hint: "Pick a profession",
        label: "Profession",
        name: "title",
        options: this.props.options.map(o => ({
          ...o,
          classes: 'u-1/3',
          icon: 'Password' })) }));



  }}

// END FORM FIELDS

// BEGIN FORM FIELD CONTROLS
_defineProperty(ProfessionTitleField, "propTypes", { options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })).isRequired });class FormField extends React.Component {// refactor, missing propTypes














  renderFields(props) {
    const {
      fields,
      hint,
      icon } =
    props;
    const errors = fields.map(({ name }) => {
      const {
        meta: {
          error,
          touched }
        // refactor, ¯\_(ツ)_/¯ @ next line
      } = eval(`props.${name}`); // eslint-disable-line no-eval
      return touched && error; // refactor, `touched` might not be behaving as expected?
    }).filter(i => i);
    const error = errors[0] || props.error;
    const message = error || hint;
    const className = classNames({
      'c-form-field': true,
      'c-form-field--error': !!error });

    const Icon = SVGIcon[icon];
    return (
      React.createElement("div", { className },
      React.createElement("div", { className: "o-media" },
      React.createElement("div", { className: "o-media__img c-form-field__img" },
      icon && React.createElement(Icon, null)),

      React.createElement("div", { className: "o-media__body" },
      React.createElement("div", { className: "c-form-field__control" },
      fields.map((field, key) => {
        const {
          format,
          name,
          normalize,
          parse,
          placeholder,
          type } =
        field; // refactor, what else is in `props.${name}`?
        // refactor, I had to comment out the line below to make this work with FormSection
        // const {input} = eval(`props.${name}`); // eslint-disable-line no-eval
        const inputClassName = classNames({
          'c-form-field__input': true,
          '5625463739': false,
          [field.className]: field.className && true // refactor, `&& true`?  I don't get it
        });
        return (
          React.createElement(Field, _extends({
            className: inputClassName,
            component: "input" },
          { key, placeholder, type, format, normalize, parse, name })));


      })),

      React.createElement("div", { className: "c-form-field__hint" }, message)))));




  }

  render() {
    const {
      fields,
      hint,
      icon } =
    this.props;
    return (
      React.createElement(Fields, _extends({
        component: this.renderFields,
        names: fields.map(({ name }) => name) },
      { fields, hint, icon })));


  }}_defineProperty(FormField, "propTypes", { icon: PropTypes.string, fields: PropTypes.arrayOf(PropTypes.shape({ className: PropTypes.string, format: PropTypes.func, name: PropTypes.string.isRequired, normalize: PropTypes.func, parse: PropTypes.func, placeholder: PropTypes.string.isRequired, // refactor, is this really required?  Is this used for making checkboxes/radios?
    type: PropTypes.string.isRequired })), hint: PropTypes.string });

class TextDisplayControl extends React.Component {
  render() {
    return (
      React.createElement("span", null, this.props.input.value));

  }}


class TextInputControl extends React.Component {





  render() {
    const {
      input,
      type,
      placeholder,
      meta: {
        error,
        touched } } =

    this.props;
    const className = classNames({
      'c-input-control': true,
      'c-input-control--error': touched && error });

    return (
      React.createElement("div", { className },
      React.createElement("input", _extends({
        className: "c-input-control__input" },
      input,
      { type, placeholder })),

      React.createElement("div", { className: "c-input-control__hint c-text-small" }, touched && error)));


  }}_defineProperty(TextInputControl, "propTypes", { placeholder: PropTypes.string, type: PropTypes.string.isRequired });


class RadioControl extends React.Component {
  handleChange(value) {
    return () => {
      this.props.input.onChange(value);
    };
  }

  render() {
    const {
      hint,
      input: {
        value,
        name },

      meta: {
        error,
        touched },

      options } =
    this.props;
    const message = touched && error || hint;
    const className = classNames({
      'c-form-radio': true,
      'c-form-radio--error': touched && !!error });

    return (
      React.createElement("div", { className },
      React.createElement("div", { className: "o-layout" },
      options.map((field, key) => {
        const Icon = SVGIcon[field.icon];
        const fieldClasses = field.classes || '';
        return (
          React.createElement("div", _extends({
            className: `c-form-radio__item o-layout__item ${fieldClasses}` },
          { key }),

          React.createElement("input", _extends({
            checked: value === field.value,
            className: "c-form-radio__field u-hidden-visually",
            id: `${name}-${key}`,
            onChange: this.handleChange(field.value),
            type: "radio",
            value: field.value },
          { name })),

          React.createElement("label", {
            className: "c-form-radio__label",
            htmlFor: `${name}-${key}` },

          field.icon && Icon && React.createElement(Icon, { active: value === field.value }),
          field.label)));



      }),
      React.createElement("div", { className: "o-layout__item u-1/1 c-form-radio__message" },
      React.createElement("div", { className: "c-form-radio__hint" }, message)))));




  }}

// END FORM FIELD CONTROLS

// BEGIN SELECTORS
const getUiState = state => state.ui;

const getJobApplicationsState = state => state.jobApplications;

const getUsername = (state, ownProps) => {
  const jobApplicationsState = getJobApplicationsState(state, ownProps);
  return jobApplicationsState.username;
};

const getIsContactDetailsComplete = (state, ownProps) => {
  const username = getUsername(state, ownProps);
  return !!username;
};

const getParams = (state, ownProps) => {
  const uiState = getUiState(state, ownProps);
  return uiState.params;
};

const getParamsProfession = (state, ownProps) => {
  const params = getParams(state, ownProps);
  return params.profession;
};

const getParamsSpecialization = (state, ownProps) => {
  const params = getParams(state, ownProps);
  return params.specialization;
};

const getParamsRole = (state, ownProps) => {
  const params = getParams(state, ownProps);
  return params.role;
};

const getParamsConcentration = (state, ownProps) => {
  const params = getParams(state, ownProps);
  return params.concentration;
};

const getJobsConfig = () => professionsConfig;

const getProfessionOptions = (state, ownProps) => {
  const jobsConfig = getJobsConfig(state, ownProps);
  return Object.keys(jobsConfig).map(professionKey => {
    const professionConfig = jobsConfig[professionKey];
    return {
      label: professionConfig.label,
      value: professionConfig.value };

  });
};

const getSpecializationOptions = (state, ownProps) => {
  const jobsConfig = getJobsConfig(state, ownProps);
  const profession = getParamsProfession(state, ownProps);
  const {
    specializations } =
  jobsConfig[profession];
  return Object.keys(specializations).map(specializationKey => {
    const specializationConfig = specializations[specializationKey];
    return {
      label: specializationConfig.label,
      value: specializationConfig.value };

  });
};

const getRoleOptions = (state, ownProps) => {
  const jobsConfig = getJobsConfig(state, ownProps);
  const profession = getParamsProfession(state, ownProps);
  const specialization = getParamsSpecialization(state, ownProps);
  const {
    roles } =
  jobsConfig[profession].specializations[specialization];
  return Object.keys(roles).map(roleKey => {
    const roleConfig = roles[roleKey];
    return {
      label: roleConfig.label,
      value: roleConfig.value };

  });
};

const getConcentrationOptions = (state, ownProps) => {
  const jobsConfig = getJobsConfig(state, ownProps);
  const profession = getParamsProfession(state, ownProps);
  const specialization = getParamsSpecialization(state, ownProps);
  const role = getParamsRole(state, ownProps);
  const {
    concentrations } =
  jobsConfig[profession].specializations[specialization].roles[role];
  return Object.keys(concentrations).map(concentrationKey => {
    const concentrationConfig = concentrations[concentrationKey];
    return {
      label: concentrationConfig.label,
      value: concentrationConfig.value };

  });
};

const getProgressPages = (state, ownProps) => {
  const lookup = [
  {
    label: 'Contact',
    complete: false,
    active: false },
  {
    label: 'Profession',
    complete: false,
    active: false },
  {
    label: 'Specialization',
    complete: false,
    active: false },
  {
    label: 'Role',
    complete: false,
    active: false },
  {
    label: 'Concentration',
    complete: false,
    active: false },
  {
    label: 'File Upload',
    complete: false,
    active: false },
  {
    label: 'Success',
    complete: false,
    active: false }];


  const index = parseInt(ownProps.routes[ownProps.routes.length - 1].wizardProgress, 10); // TODO refactor, i don't trust this...
  for (let i = 0; i < index; i++) {if (window.CP.shouldStopExecution(0)) break;
    lookup[i].complete = true;
  }window.CP.exitedLoop(0);
  lookup[index].active = true;
  return lookup;
};
// END SELECTORS
