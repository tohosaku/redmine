import { Controller } from "@hotwired/stimulus"
import { setDisplay } from "helper"

// Connects to data-controller="queries--form-display-type"
export default class extends Controller {
  static targets = ['element']
  static values  = { 'default': String }

  changeDisplayType(e) {
    if (e.target.matches('input[name=display_type]')) {
      const option = document.querySelector('input[name=display_type]:checked').value;
      const display = option !== this.defaultValue
      this.elementTargets.forEach(e => setDisplay(e, display));
    }
  }
}
