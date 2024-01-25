import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="availability"
export default class extends Controller {
  static targets = ['field'];

  enableIfChecked(e) {
    this.fieldTarget.disabled = !e.currentTarget.checked
  }

  disableIfChecked(e) {
    this.fieldTarget.disabled = e.currentTarget.checked
  }

  toggle(e) {
    if (typeof e.params !== 'undefined') {
      this.fieldTarget.disabled = e.params.matched;
    }
  }
}
