/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="repositories--navigation"
export default class extends Controller {
  static targets = ['select', 'revision']
  /*
    If we're viewing a tag or branch, don't display it in the
    revision box
  */
  connect() {
    const selected = this.selectTargets.some(s => this.hasRevisionTarget && s.value == this.revisionTarget.value)
    if (selected && this.hasRevisionTarget) {
      this.revisionTarget.value = ''
    }
  }

  /*
    Copy the branch/tag value into the revision box, then disable
    the dropdowns before submitting the form
  */
  copy(e) {
    if (this.hasRevisionTarget) {
      this.revisionTarget.value = e.currentTarget.value
    }
    this.selectTargets.forEach(s => {s.disabled = true})
    this.element.requestSubmit();
    this.selectTargets.forEach(s => {s.disabled = false})
  }

  /*
    Disable the branch/tag dropdowns before submitting the revision form
  */
  update(e) {
    if (e.keyCode == 13) {
      this.selectTargets.forEach(s => {s.disabled = true})
      this.element.requestSubmit();
      this.selectTargets.forEach(s => {s.disabled = false})
    }
  }
}
