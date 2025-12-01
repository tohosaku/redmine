/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dialog"
export default class extends Controller {

  static targets = [ 'handle', 'cancel' ]
  static values = {
    modal: { type: Boolean, default: true },
    wrapperId: { type: String, default: 'wrapper' }
  }

  connect() {
    this.dragging = null;
    this.backdrop = null;
    this.element[`${this.identifier}_controller`] = this;
    this.wrapper = document.getElementById(this.wrapperIdValue)
  }

  start(e) {
    if (this.cancelTarget.contains(e.target)) return;
    if (e.button !== 0) return; // left button only

    this.handleTarget.style.userSelect = 'none'; // if there's text
    this.handleTarget.style.webkitUserSelect = 'none'; // safari

    this.dispatch('start', {detail: {clientX: e.clientX, clientY: e.clientY}});
  }

  end(e) {
    this.dispatch('end')

    this.handleTarget.style.userSelect = ''; // if there's text
    this.handleTarget.style.webkitUserSelect = ''; // safari
  }

  show({width = undefined, backdrop = 'modal-backdrop'}) {
    this.element.style.display = '';
    if (width) {
      this.element.style.width = width;
    }

    if (this.modalValue) {
      this.backdrop = document.getElementById(backdrop)
      this.backdrop.classList.add('modal-backdrop-open')
      this.wrapper.inert = true
      this.element.classList.add('modal')
    }
  }

  hide(e) {
    this.hideDialog()
  }

  cancel(e) {
    e.preventDefault();
    this.hideDialog()
  }

  hideDialog() {
    this.element.style.display = 'none'
    if (this.backdrop !== null) {
      this.backdrop.classList.remove('modal-backdrop-open')
    }
    if (this.wrapper !== null) {
      this.wrapper.inert = false
    }
  }
}
