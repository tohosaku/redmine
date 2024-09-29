import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="visibility"
export default class extends Controller {
  static targets = ['field', 'dummy']

  dummyTargetConnected(element) {
    this.toggleElements([this.element]);
    element.remove();
  }

  toggle(e) {
    e.preventDefault();

    this.toggleElements(document.querySelectorAll(e.params.selector))
  }

  toggleField(e) {
    e.preventDefault();

    this.toggleElements(this.fieldTargets)
  }

  hide(e) {
    e.preventDefault();
    this.hideElement(this.element);
  }

  hideElement(element) {
    element.style.display = 'none';
  }

  toggleElements(elements) {
    elements.forEach(el => {
      if (el.style.display == 'none') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    })
  }
}
