import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal-dispatcher"
export default class extends Controller {
  static targets = [ 'show' ];
  static outlets = [ 'modal' ];

  show(e) {
    e.preventDefault();
    this.modalOutlet.show(e.params.width)
    this.modal = this.modalOutlet
  }

  showTargetConnected(dialog) {
    dialog.modal_controller.show(dialog.dataset.width, this.element.id)
    this.modal = dialog.modal_controller
  }

  hideTargetConnected(element) {
    this.modal.hide()
    element.remove()
  }
}
