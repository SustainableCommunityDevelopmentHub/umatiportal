var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* App */
class App extends React.Component {
  constructor(args) {
    super(args);

    // Assign unique IDs to the emails
    const emails = this.props.emails;
    let id = 0;
    for (const email of emails) {
      email.id = id++;
    }

    this.state = {
      selectedEmailId: 0,
      currentSection: 'inbox',
      emails };

  }

  openEmail(id) {
    const emails = this.state.emails;
    const index = emails.findIndex(x => x.id === id);
    emails[index].read = 'true';
    this.setState({
      selectedEmailId: id,
      emails });

  }

  deleteMessage(id) {
    // Mark the message as 'deleted'
    const emails = this.state.emails;
    const index = emails.findIndex(x => x.id === id);
    emails[index].tag = 'deleted';

    // Select the next message in the list
    let selectedEmailId = '';
    for (const email of emails) {
      if (email.tag === this.state.currentSection) {
        selectedEmailId = email.id;
        break;
      }
    }

    this.setState({
      emails,
      selectedEmailId });

  }

  setSidebarSection(section) {
    let selectedEmailId = this.state.selectedEmailId;
    if (section !== this.state.currentSection) {
      selectedEmailId = '';
    }

    this.setState({
      currentSection: section,
      selectedEmailId });

  }

  render() {
    const currentEmail = this.state.emails.find(x => x.id === this.state.selectedEmailId);
    return (
      React.createElement("div", null,
      React.createElement(Sidebar, {
        emails: this.props.emails,
        setSidebarSection: section => {this.setSidebarSection(section);} }),
      React.createElement("div", { className: "inbox-container" },
      React.createElement(EmailList, {
        emails: this.state.emails.filter(x => x.tag === this.state.currentSection),
        onEmailSelected: id => {this.openEmail(id);},
        selectedEmailId: this.state.selectedEmailId,
        currentSection: this.state.currentSection }),
      React.createElement(EmailDetails, {
        email: currentEmail,
        onDelete: id => {this.deleteMessage(id);} }))));



  }}


/* Sidebar */
const Sidebar = ({ emails, setSidebarSection }) => {
  var unreadCount = emails.reduce(
  function (previous, msg) {
    if (msg.read !== "true") {
      return previous + 1;
    } else
    {
      return previous;
    }
  }.bind(this), 0);

  var deletedCount = emails.reduce(
  function (previous, msg) {
    if (msg.tag === "deleted") {
      return previous + 1;
    } else
    {
      return previous;
    }
  }.bind(this), 0);

  return (
    React.createElement("div", { id: "sidebar" },
    React.createElement("div", { className: "sidebar__compose" },
    React.createElement("a", { href: "#", className: "btn compose" }, "Compose ",
    React.createElement("span", { className: "fa fa-pencil" }))),


    React.createElement("ul", { className: "sidebar__inboxes" },
    React.createElement("li", { onClick: () => {setSidebarSection('inbox');} }, React.createElement("a", null,
    React.createElement("span", { className: "fa fa-inbox" }), " Inbox",
    React.createElement("span", { className: "item-count" }, unreadCount))),
    React.createElement("li", { onClick: () => {setSidebarSection('sent');} }, React.createElement("a", null,
    React.createElement("span", { className: "fa fa-paper-plane" }), " Sent",
    React.createElement("span", { className: "item-count" }, "0"))),
    React.createElement("li", { onClick: () => {setSidebarSection('drafts');} }, React.createElement("a", null,
    React.createElement("span", { className: "fa fa-pencil-square-o" }), " Drafts",
    React.createElement("span", { className: "item-count" }, "0"))),

    React.createElement("li", { onClick: () => {setSidebarSection('deleted');} }, React.createElement("a", null,
    React.createElement("span", { className: "fa fa-trash-o" }), " Trash",
    React.createElement("span", { className: "item-count" }, deletedCount))))));




};

/* Email classes */
const EmailListItem = ({ email, onEmailClicked, selected }) => {
  let classes = "email-item";
  if (selected) {
    classes += " selected";
  }

  return (
    React.createElement("div", { onClick: () => {onEmailClicked(email.id);}, className: classes },
    React.createElement("div", { className: "email-item__unread-dot", "data-read": email.read }),
    React.createElement("div", { className: "email-item__subject truncate" }, email.subject),
    React.createElement("div", { className: "email-item__details" },
    React.createElement("span", { className: "email-item__from truncate" }, email.from),
    React.createElement("span", { className: "email-item__time truncate" }, getPrettyDate(email.time)))));



};

const EmailDetails = ({ email, onDelete }) => {
  if (!email) {
    return (
      React.createElement("div", { className: "email-content empty" }));

  }

  const date = `${getPrettyDate(email.time)} · ${getPrettyTime(email.time)}`;

  const getDeleteButton = () => {
    if (email.tag !== 'deleted') {
      return React.createElement("span", { onClick: () => {onDelete(email.id);}, className: "delete-btn fa fa-trash-o" });
    }
    return undefined;
  };

  return (
    React.createElement("div", { className: "email-content" },
    React.createElement("div", { className: "email-content__header" },
    React.createElement("h3", { className: "email-content__subject" }, email.subject),
    getDeleteButton(),
    React.createElement("div", { className: "email-content__time" }, date),
    React.createElement("div", { className: "email-content__from" }, email.from)),

    React.createElement("div", { className: "email-content__message" }, email.message)));


};

/* EmailList contains a list of Email components */
const EmailList = ({ emails, onEmailSelected, selectedEmailId }) => {
  if (emails.length === 0) {
    return (
      React.createElement("div", { className: "email-list empty" }, "Nothing to see here, great job!"));



  }

  return (
    React.createElement("div", { className: "email-list" },

    emails.map(email => {
      return (
        React.createElement(EmailListItem, {
          onEmailClicked: id => {onEmailSelected(id);},
          email: email,
          selected: selectedEmailId === email.id }));

    })));



};

// Render
$.ajax({ url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
  type: 'GET',
  success: function (result) {
    React.render(React.createElement(App, { emails: result }), document.getElementById('inbox'));
  } });



// Helper methods
const getPrettyDate = date => {
  date = date.split(' ')[0];
  const newDate = date.split('-');
  const month = months[0];
  return `${month} ${newDate[2]}, ${newDate[0]}`;
};

// Remove the seconds from the time
const getPrettyTime = date => {
  const time = date.split(' ')[1].split(':');
  return `${time[0]}:${time[1]}`;
};