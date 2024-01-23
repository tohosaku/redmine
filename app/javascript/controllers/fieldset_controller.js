import { Controller } from "@hotwired/stimulus"
import { toggleClass } from "dom"

// Connects to data-controller="fieldset"
export default class extends Controller {
  static values = { hidden: Boolean }
  connect() {
    if (this.hiddenValue) {
      this.element.classList.toggle('collapsed')
      this.element.querySelectorAll('div').forEach(el => (el.style.display = 'none'))
    }
  }

  toggle(e) {
    this.element.classList.toggle('collapsed');
    this.element.querySelectorAll('legend').forEach(el => toggleClass(el, 'icon-expanded', 'icon-collapsed'))

    this.element.querySelectorAll('div').forEach(el => {
      const display = el.style.display == 'none' ? '' : 'none';
      el.style.display = display;
    })
  }
}
