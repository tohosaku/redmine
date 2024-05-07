/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="template"
export default class extends Controller {
  static targets = ['element']

  elementTargetConnected(element) {
    const clone = element.content.cloneNode(true);
    this.element.prepend(clone);
    element.remove()
  }
}
