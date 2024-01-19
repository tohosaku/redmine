import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="checkbox"
export default class extends Controller {
  toggle(e) {
    e.preventDefault();

    const elements = Array.from(this.element.querySelectorAll(e.params.selector));
    const allChecked  = elements.every(el => el.checked);

    elements.forEach(el => el.checked = !allChecked);
    const event = new Event('change');
    this.element.dispatchEvent(event);
  }
}
