/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import Tribute from '@redmine-ui/tribute'
import { FetchRequest, post, put, patch, destroy } from '@rails/request.js'

export function metaContent (name) {
  const element = document.head.querySelector(`meta[name="${name}"]`)
  return element && element.content
}

export function jsonContent(id) {
  const json = document.getElementById(id);
  if (json === null) throw new Error(`Element #${id} is not found`)
  if (!(json.tagName === 'SCRIPT' && json.getAttribute('type', 'application/json'))) throw new Error(`Element #${id} should be script element`)

  return JSON.parse(json.textContent)
}

export function updateSVGIcon(element, icon) {
  const iconElement = element.getElementsByTagName('use').item(0)

  if (iconElement === null) return false;

  const iconPath = iconElement.getAttribute('href');
  iconElement.setAttribute('href', iconPath.replace(/#.*$/g, "#icon--" + icon))
}

export function isMobile() {
  const element = document.querySelector('.js-flyout-menu-toggle-button')
  return isVisible(element);
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

export function createQuery(element, source) {
  if (typeof source === 'undefined') return;

  const func = typeof source === 'string' ? (text) => (new URLInfo(source)).setParam('term', text)
                                          : source;

  return (text, cb) => {
    const request = new FetchRequest('get', func(text), { responseKind: 'json' })
    withProgress(request.perform(), element)
      .then(res => {
        if (!res.ok) throw new Error();

        return res.json;
      })
      .then(json => cb(json))
  }
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
