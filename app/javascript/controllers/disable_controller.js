import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="disable"
export default class extends Controller {
  static targets = ['field', 'checkbox'];

  toggle(e) {
    if (e.currentTarget.checked){
      this.fieldTarget.value = ''
    }
    this.fieldTarget.disabled = e.currentTarget.checked
  }

  checkboxTargetConnected(element) {
    const event = new Event('change');
    element.dispatchEvent(event);
  }
}
