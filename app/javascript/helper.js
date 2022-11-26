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

export function updateSVGIcon(element, icon) {
  const iconElement = element.getElementsByTagName('use').item(0)

  if (iconElement === null) return false;

  const iconPath = iconElement.getAttribute('href');
  iconElement.setAttribute('href', iconPath.replace(/#.*$/g, "#icon--" + icon))
}

export function isMobile() {
  const element = document.querySelector('.js-flyout-menu-toggle-button')
  const style = window.getComputedStyle(element);
  return (style.display !== 'none')
}

export function isVisible(element) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('The argument must be a valid DOM element.');
  }

  const style = getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}

export function setDisplay(element, visible) {
  if (visible) {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

export function switchClass(element, fromClass, toClass, reverse = false) {
  if (element == null) return;

  element.classList.toggle(fromClass, reverse)
  element.classList.toggle(toClass, !reverse)
}

export function prevAll(element, selector) {
  const sibs = [];
  let current = element;
  while (current = current.previousSibling) {
    if (current.matches(selector)) {
      sibs.push(current);
    }
  }
  return sibs;
}

export function nextAll(element, tagName) {
  const sibs = [];
  let nextElem = element.parentNode.firstChild;
  let current = element;
  do {
    if (nextElem === current) continue; // ignore elem of target
    if (nextElem === current.nextElementSibling) {
      if (current.tagName === tagName.toUpperCase()) {
        sibs.push(nextElem);
        current = nextElem;
      }
    }
  } while(nextElem = nextElem.nextSibling)
  return sibs;
}

export function toBoolean(str) {
  if (typeof str !== 'string') return;

  return str.toLowerCase() === 'true' ? true
                                      : str.toLowerCase() === 'false' ? false
                                                                      : undefined
}

export function withProgress(request, element) {
  const event = new CustomEvent('redmine:before-fetch-request')
  element.dispatchEvent(event);

  const loading = 'ajax-loading';
  element.classList.add(loading)

  return request.finally(() => {
    element.classList.remove(loading)
    const event = new CustomEvent('redmine:complete-fetch-request')
    element.dispatchEvent(event);
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

export const matched = ({ event, value }) => {
  const condition = event.target.dataset.condition;

  if (typeof condition !== 'undefined') {
    event.params.matched = (value === (event.target.value === condition))
  }
  return true
}

export const guardUnmatch = ({ event, value }) => {
  const condition = event.target.dataset.condition;

  if (typeof condition !== 'undefined') {
    event.params.matched = (value === (event.target.value === condition))
    return event.params.matched;
  }
  return true
}
