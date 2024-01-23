import { Controller } from "@hotwired/stimulus"
import Tribute from '@redmine-ui/tribute'

// Connects to data-controller="inline-autocomplete"
export default class extends Controller {
  connect() {
    inlineAutoComplete(this.element);
  }
}

function sanitizeHTML(string) {
  var temp = document.createElement('span');
  temp.textContent = string;
  return temp.innerHTML;
}

function inlineAutoComplete(element) {

  // do not attach if Tribute is already initialized
  if (element.dataset.tribute === 'true') return;

  const getDataSource = (entity) => {
    const dataSources = rm.AutoComplete.dataSources;

    if (dataSources[entity]) {
      return dataSources[entity];
    } else {
      return false;
    }
  }

  const remoteSearch = (url, cb) => {
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        cb([])
      })
      .then(data => {
        cb(data);
      })
  };

  const tribute = new Tribute({
    collection: [
      {
        trigger: '#',
        values: (text, cb) => {
          if (event.target.type === 'text' && element.getAttribute('autocomplete') != 'off') {
            element.setAttribute('autocomplete', 'off');
          }
          const url = getDataSource('issues') + encodeURIComponent(text);
          remoteSearch(url, (issues) => cb(issues))
        },
        lookup: 'label',
        fillAttr: 'label',
        requireLeadingSpace: true,
        selectTemplate: function (issue) {
          // keep ## syntax which is a valid issue syntax to show issue with title.
          const leadingHash = this.currentMentionTextSnapshot.charAt(0) === "#" ? "##"
            : "#";

          return leadingHash + issue.original.id;
        },
        menuItemTemplate: (issue) => sanitizeHTML(issue.original.label)
      },
      {
        trigger: '[[',
        values: (text, cb) => {
          const url = getDataSource('wiki_pages') + encodeURIComponent(text);
          remoteSearch(url, (wikiPages) => cb(wikiPages));
        },
        lookup: 'label',
        fillAttr: 'label',
        requireLeadingSpace: true,
        selectTemplate: (wikiPage) => `[[${wikiPage.original.value}]]`,
        menuItemTemplate: (wikiPage) => sanitizeHTML(wikiPage.original.label)
      },
      {
        trigger: '@',
        lookup: (user, mentionText) => `${user.name}${user.firstname}${user.lastname}${user.login}`,
        values: (text, cb) => {
          const url = getDataSource('users');
          if (url) {
            remoteSearch(url + encodeURIComponent(text), (users) => cb(users));
          }
        },
        menuItemTemplate: (user) => user.original.name,
        selectTemplate: (user) => '@' + user.original.login
      }
    ],
    noMatchTemplate: ""
  });

  tribute.attach(element);
}
