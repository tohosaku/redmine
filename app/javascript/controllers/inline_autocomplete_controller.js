import { Controller } from "@hotwired/stimulus"
import Tribute from '@redmine-ui/tribute'
import { createQuery } from 'helper'

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

function getDataSource(entity) {
  const dataSources = rm.AutoComplete.dataSources;

  if (dataSources[entity]) {
    return dataSources[entity];
  } else {
    return false;
  }
}

function inlineAutoComplete(element) {

  // do not attach if Tribute is already initialized
  if (element.dataset.tribute === 'true') return;

  const tribute = new Tribute({
    collection: [
      {
        trigger: '#',
        values: createQuery(element, (text) => {
          if (event.target.type === 'text' && element.getAttribute('autocomplete') != 'off') {
            element.setAttribute('autocomplete', 'off');
          }
          // When triggered with text starting with "##", like "##a", the search term will become "#a",
          // causing the SQL query to fail in finding issues with "a" in the subject.
          // To avoid this, remove the first "#" from the search term.
          if (text) {
            text = text.replace(/^#/, '');
          }
          return getDataSource('issues') + encodeURIComponent(text);
        }),
        lookup: 'label',
        fillAttr: 'label',
        requireLeadingSpace: true,
        selectTemplate: function(issue) {
          // keep ## syntax which is a valid issue syntax to show issue with title.
          const leadingHash = this.currentMentionTextSnapshot.charAt(0) === "#" ? "##"
                                                                                : "#";

          return leadingHash + issue.original.id;
        },
        menuItemTemplate: (issue) => sanitizeHTML(issue.original.label)
      },
      {
        trigger: '[[',
        values: createQuery(element, (text) => getDataSource('wiki_pages') + encodeURIComponent(text)),
        lookup: 'label',
        fillAttr: 'label',
        requireLeadingSpace: true,
        selectTemplate: (wikiPage) => `[[${wikiPage.original.value}]]`,
        menuItemTemplate: (wikiPage) => sanitizeHTML(wikiPage.original.label)
      },
      {
        trigger: '@',
        lookup: (user, mentionText) => `${user.name}${user.firstname}${user.lastname}${user.login}`,
        values: createQuery(element, (text) => {
          const url = getDataSource('users');
          if (url) {
            return url + encodeURIComponent(text)
          }
        }),
        menuItemTemplate: (user) => user.original.name,
        selectTemplate: (user) => '@' + user.original.login
      }
    ],
    noMatchTemplate: ""
  });

  tribute.attach(element);
}
