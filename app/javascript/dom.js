/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function toBoolean(str) {
  if (typeof str !== 'string') return;

  return str.toLowerCase() === 'true' ? true
                                      : str.toLowerCase() === 'false' ? false
                                                                      : undefined
}
