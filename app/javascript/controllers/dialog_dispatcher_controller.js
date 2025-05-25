/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dialog-dispatcher"
export default class extends Controller {
  static targets = [ 'show', 'hide' ];
  static outlets = [ 'dialog' ];

  show(e) {
    e.preventDefault();
    this.dialog = this.dialogOutlet
    this.dialog.show({width: e.params.width})
  }

  showTargetConnected(dialog) {
    this.dialog = dialog.dialog_controller
    this.dialog.show({width: dialog.dataset.width, backdrop: this.element.id})
  }

  hideTargetConnected(element) {
    this.dialog.hide()
    element.remove()
  }
}
