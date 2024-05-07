/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function generateElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild
}
