import { Controller } from "@hotwired/stimulus"
import { toggleClass } from "dom"

// Connects to data-controller="fieldset"
export default class extends Controller {
  static values = { hidden: Boolean }
  static targets = ['display']

  connect() {
    if (this.hiddenValue) {
      this.element.classList.add('collapsed')
      this.displayTargets.forEach(el => {el.style.display = 'none'})
    }
  }

  toggle(e) {
    this.element.classList.toggle('collapsed');
    this.element.querySelectorAll('legend').forEach(el => toggleClass(el, 'icon-expanded', 'icon-collapsed'))

    toggleExpendCollapseIcon(this.element.querySelector('legend'))
    this.displayTargets.forEach(el => {
      const display = el.style.display == 'none' ? 'block' : 'none';
      el.style.display = display;
    })
  }
}
