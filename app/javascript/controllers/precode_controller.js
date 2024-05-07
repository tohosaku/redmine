/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="precode"
export default class extends Controller {
  connect() {
    this.currentElem = null;
  }

  select(e) {
    if (this.currentElem) return;

    let target = event.target.closest('.jst_menuitem');
    if (!target || !this.element.contains(target)) return;

    this.currentElem = target;
    target.classList.add('jst_menuitem-active')
  }

  unselect(e) {
    if (!this.currentElem) return;

    let relatedTarget = event.relatedTarget;
    if (relatedTarget) {
      while (relatedTarget) {
        if (relatedTarget == this.currentElem) return;
        relatedTarget = relatedTarget.parentNode;
      }
    }
    this.currentElem.classList.remove('jst_menuitem-active')
    this.currentElem = null;
  }

  addMenu(e) {
    this.element.addMenu(e.target.textContent)
  }

  remove(e) {
    this.element.remove();
  }

  removeWhenOutside(e) {
    if (!e.target.matches('.jstb_precode') && !this.element.contains(e.target)) {
      this.remove();
    }
  }
}
