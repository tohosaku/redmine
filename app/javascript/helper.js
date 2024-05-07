/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function jsonContent(id) {
  const json = document.getElementById(id);
  if (json === null) throw new Error(`Element #${id} is not found`)
  if (!(json.tagName === 'SCRIPT' && json.getAttribute('type', 'application/json'))) throw new Error(`Element #${id} should be script element`)

  return JSON.parse(json.textContent)
}

export function isMac() {
  return Boolean(navigator.platform.toLowerCase().match(/mac/));
}
