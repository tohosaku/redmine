import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--selected"
export default class extends Controller {
  static targets = ['select']
  moveOptionTop(e) {
    const selected = this.selectTarget.selectedOptions[0];
    if (typeof selected !== 'undefined') {
      this.selectTarget.insertAdjacentElement('afterbegin', selected);
    }
  }

  moveOptionUp(e) {
    Array.from(this.selectTarget.selectedOptions).forEach(element => {
      const target = prev(element, ':not([selected=selected])')
      if (target !== null) {
        target.insertAdjacentElement('beforebegin', element)
      }
    })
  }

  moveOptionDown(e) {
    Array.from(this.selectTarget.selectedOptions).reverse().forEach(element => {
      const target = next(element, ':not([selected=selected])')
      if (target !== null) {
        target.insertAdjacentElement('afterend', element)
      }
    })
  }

  moveOptionBottom(e) {
    const selected = this.selectTarget.selectedOptions[0];
    if (typeof selected !== 'undefined') {
      this.selectTarget.insertAdjacentElement('beforeend', selected);
    }
  }
}

function prev(el, selector) {
  const prevEl = el.previousElementSibling;
  if (!selector || (prevEl && prevEl.matches(selector))) {
    return prevEl;
  }
  return null;
}

function next(el, selector) {
  const nextEl = el.nextElementSibling;
  if (!selector || (nextEl && nextEl.matches(selector))) {
    return nextEl;
  }
  return null;
}
