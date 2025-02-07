import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="filecontent"
export default class extends Controller {
  connect() {
    this.setHeight()
  }

  setHeight(e) {
    const files = this.element.querySelectorAll('.image, video')
    if (files.length === 1) {
      this.element.style.height = `calc(100vh - ${this.diff}px)`
    }
  }

  get diff() {
    const containerOffsetTop    = offsetTop(this.element);
    const containerMarginBottom = Number.parseInt(getStyleValue(this.element, 'margin-bottom'));
    const paginationHeight      = next(this.element, '.pagination').getBoundingClientRect().height;

    return containerOffsetTop + containerMarginBottom + paginationHeight;
  }
}

function offsetTop(element) {
  const rect      = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}

function getStyleValue(element, rule) {
  return getComputedStyle(element)[rule];
}

function next(el, selector) {
  const nextEl = el.nextElementSibling;
  if (!selector || (nextEl && nextEl.matches(selector))) {
    return nextEl;
  }
  return null;
}
