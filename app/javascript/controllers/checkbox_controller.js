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

  checkAll(e) {
    const elements = document.getElementById(e.params.id).querySelectorAll('input[type=checkbox]:enabled');
    Array.from(elements).forEach(el => el.checked = e.params.checked);
  }

  inspect(e) {
    const event = new CustomEvent('checkbox:inspect')
    event.param = { matched: this.element.checked }
    this.element.dispatchEvent(event);
  }
}
