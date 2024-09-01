import { Controller } from "@hotwired/stimulus"
import { toBoolean } from "dom"

// Connects to data-controller="visibility"
export default class extends Controller {
  static targets = ['field', 'dummy']

  dummyTargetConnected(element) {
    const force = toBoolean(element.dataset.force);
    this.toggleElements([this.element], force);
    element.remove();
  }

  toggle(e) {
    e.preventDefault();
    let force
    if (typeof e.detail !== 'undefined') {
      force = e.detail.matched
    }

    this.toggleElements(document.querySelectorAll(e.params.selector), force)
  }

  toggleField(e) {
    e.preventDefault();

    this.toggleElements(this.fieldTargets)
  }

  show(e) {
    e.preventDefault();

    if (e.params.selector) {
      document.querySelectorAll(e.params.selector).forEach(element => {
        this.showElement(element);
      })
    } else {
      this.showElement(this.element);
    }
  }

  showElement(element) {
    element.style.display = '';
  }

  hide(e) {
    e.preventDefault();
    this.hideElement(this.element);
  }

  hideElement(element) {
    element.style.display = 'none';
  }

  toggleElements(elements, force) {
    elements.forEach(el => {
      const visible = typeof force !== 'undefined' ? force
                                                   : el.style.display == 'none'
      if (visible) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
      this.dispatch('toggle', { target: el, detail: { source: this.element, visible: visible } })
    })
  }
}
