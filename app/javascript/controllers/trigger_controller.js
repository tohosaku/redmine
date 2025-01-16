import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="trigger"
export default class extends Controller {
  connect() {
    const event = new Event('change');
    this.element.dispatchEvent(event);
  }
}
