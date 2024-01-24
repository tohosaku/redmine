import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="documents--show"
export default class extends Controller {
  static target = ['form']

  show(e) {
    this.formTarget.style.display = '';
  }
}
