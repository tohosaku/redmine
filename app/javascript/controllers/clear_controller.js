/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ['element'];

  clearIfChecked(e) {
    if (!e.target.checked) return

    this.elementTargets.forEach(element => {
      element.value = ''
    })
  }
}
