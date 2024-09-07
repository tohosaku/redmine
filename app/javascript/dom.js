/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function switchClass(element, fromClass, toClass, reverse = false) {
  if (element == null) return;

  element.classList.toggle(fromClass, reverse)
  element.classList.toggle(toClass, !reverse)
}
