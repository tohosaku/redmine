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

export function toBoolean(str) {
  if (typeof str !== 'string') return;

  return str.toLowerCase() === 'true' ? true
                                      : str.toLowerCase() === 'false' ? false
                                                                      : undefined
}

export function toggleClass(element, class1, class2) {
  if (element == null) return;

  if (element.classList.contains(class1)) {
    element.classList.remove(class1);
    element.classList.add(class2);
  } else if (element.classList.contains(class2)) {
    element.classList.remove(class2);
    element.classList.add(class1);
  }
}
