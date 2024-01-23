import { Controller } from "@hotwired/stimulus"
import Tribute from '@redmine-ui/tribute'
import { createQuery, sanitizeHTML } from 'helper'

// Connects to data-controller="inline-autocomplete"
export default class extends Controller {
  connect() {
    inlineAutoComplete(this.element);
  }
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

  const autocompleteSearchCache = {};
  const latestAutocompleteSearchQuery = {};

  const cachedAutocompleteResults = function(url, text) {
    const cache = autocompleteSearchCache[url];

    if (!cache) {
      return null;
    }

    if (text === cache.query) {
      return cache.results;
    }

    if (cache.query && text.startsWith(cache.query) && cache.results.length === 0) {
      return [];
    }

    return null;
  }

  const tribute = new Tribute({
    collection: [
      {
        trigger: '#',
        values: createQuery(element, (text) => {
          if (element.type === 'text' && element.getAttribute('autocomplete') != 'off') {
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
        selectTemplate: (issue, tribute) => {
          // keep ## syntax which is a valid issue syntax to show issue with title.
          const leadingHash = tribute.currentMentionTextSnapshot.charAt(0) === "#" ? "##"
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
/*
          if (!url) {
            return cb([]);
          }

          latestAutocompleteSearchQuery[url] = text;

          const cachedUsers = cachedAutocompleteResults(url, text);
          if (cachedUsers !== null) {
            return cb(cachedUsers);
          }

          remoteSearch(url + encodeURIComponent(text), function (users) {
            // Ignore stale responses for queries that are no longer current.
            if (latestAutocompleteSearchQuery[url] !== text) {
              return;
            }

            autocompleteSearchCache[url] = {
              query: text,
              results: users
            };
            return cb(users);
          });
*/
        }),
        menuItemTemplate: (user) => sanitizeHTML(user.original.name),
        selectTemplate: (user) => '@' + user.original.login
      }
    ],
    noMatchTemplate: ""
  });

  tribute.attach(element);
}
