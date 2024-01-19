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
    let force
    if (typeof e.detail !== 'undefined') {
      force = e.detail.matched
    }

    if (force === undefined) {
      this.toggleElements(document.querySelectorAll(e.params.selector))
    } else {
      this.forceToggleElements(document.querySelectorAll(e.params.selector), force)
    }
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

  forceToggleElements(elements, force) {
    elements.forEach(el => {
      let visible = false
      if (force) {
        el.style.display = '';
        visible = true;
      } else {
        el.style.display = 'none';
      }
      this.dispatch('toggle', { target: el, detail: { source: this.element, visible: visible } })
    })
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
