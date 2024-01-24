import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="settings--authentication"
export default class extends Controller {
  static targets = ['show'];

  checkAvailability(e) {
    if (e.currentTarget.value != '0') {
      this.showTarget.disabled = false;
    } else {
      this.showTarget.disabled = true;
    }
  }
}
