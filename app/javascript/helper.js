/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import Tribute from '@redmine-ui/tribute'
import { FetchRequest, post, put, patch, destroy } from '@rails/request.js'

export function jsonContent(id) {
  const json = document.getElementById(id);
  if (json === null) throw new Error(`Element #${id} is not found`)
  if (!(json.tagName === 'SCRIPT' && json.getAttribute('type', 'application/json'))) throw new Error(`Element #${id} should be script element`)

  return JSON.parse(json.textContent)
}

export function isMac() {
  return Boolean(navigator.platform.toLowerCase().match(/mac/));
}

export function metaContent (name) {
  const element = document.head.querySelector(`meta[name="${name}"]`)
  return element && element.content
}

export function isMobile() {
  const element = document.querySelector('.js-flyout-menu-toggle-button')
  const style = window.getComputedStyle(element);
  return (style.display !== 'none')
}

export function withProgress(request, element) {
  const loading = 'ajax-loading';
  element.classList.add(loading)

  return request.finally(() => {
    element.classList.remove(loading)
  });
}

export class URLInfo {
  constructor(url) {
    let query = [];

    if (url.indexOf('?') != -1) {
      query = url.split('?')
    } else if (url.indexOf(';') != -1) {
      query = url.split(';')
    } else {
      query[0] = url;
      query[1] = '';
    }

    const sp = query[0].split('/');
    this.url = query[0],
    this.domain = sp[2],
    this.protocol = sp[0].replace(':',''),
    this.query = new URLSearchParams(query[1])
  }

  appendParam(key, value) {
    this.query.append(key, value);
    return this;
  }

  setParam(key, value) {
    this.query.set(key, value);
    return this;
  }

  toString() {
    return this.url + '?' + this.query.toString();
  }
};

function debounce(func, delay) {
  let timeout;

  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export function createQuery(element, source) {
  if (typeof source === 'undefined') return;


  const func = typeof source === 'string' ? (text) => (new URLInfo(source)).setParam('term', text)
                                          : source;

  return debounce((text, cb) => {
    const request = new FetchRequest('get', func(text), { responseKind: 'json' })
    withProgress(request.perform(), element)
      .then(res => {
        if (!res.ok) throw new Error();

        return res.json;
      })
      .then(json => cb(json))
  }, 200)
}

export function observeAutocomplete(element, source, options={}) {

  const tribute = new Tribute(Object.assign({
    autocompleteMode: true,
    menuShowMinLength: 2,
    noMatchTemplate: '',
    lookup: 'label',
    values: createQuery(element, source)
  }, options));
  tribute.attach(element);

  element.classList.add('autocomplete');
}

export function sanitizeHTML(string) {
  const temp = document.createElement('span');
  temp.textContent = string;
  return temp.innerHTML;
}


