import { Controller } from "@hotwired/stimulus"
import { toBoolean } from 'helper'

// Connects to data-controller="classlist"
export default class extends Controller {
  static classes = ['toggle']
  static targets = ['dummy', 'field']

  dummyTargetConnected(element) {
    const force = toBoolean(element.dataset.force);
    this.toggleClasses.forEach(klass => {
      this.element.classList.toggle(klass, force);
    })
    element.remove();
  }

  toggle(e) {
    e.preventDefault();
    if (typeof e.params.matched !== 'undefined') {
      if (e.params.matched) {
        this.fieldTargets.forEach(element => element.classList.add(...this.toggleClasses))
      } else {
        this.fieldTargets.forEach(element => element.classList.remove(...this.toggleClasses))
      }
    } else {
      this.fieldTargets.forEach(element => {
        this.toggleClasses.forEach(klass => {
          element.classList.toggle(klass);
        })
      })
    }
  }
}
