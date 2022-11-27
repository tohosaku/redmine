/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { get, post, put, patch, destroy } from '@rails/request.js'

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
