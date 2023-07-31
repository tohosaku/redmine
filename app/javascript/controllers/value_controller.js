import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="value"
export default class extends Controller {

  static targets = ['content'];

  connect() {
    this.element.previousSibling.value = this.element.textContent;
    this.element.remove();
  }
}
