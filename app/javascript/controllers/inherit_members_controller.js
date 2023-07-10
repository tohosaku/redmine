import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="inherit-members"
export default class extends Controller {

  static values = { confirm: String }

  check(e) {
    if (!this.element.checked) {
      if (!confirm(this.confirmValue)) {
        this.element.checked = true;
      }
    }
  }
}
