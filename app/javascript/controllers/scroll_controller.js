import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="scroll"
export default class extends Controller {

  scroll(e) {
    if (e.detail.visible && e.detail.source.dataset.scroll == 'true') {
      const { top } = position(this.element);
      window.scrollTo({
        left: 0,
        top: top,
        behavior: 'smooth'
      });
    }
  }
}

function position(el) {
  const {top, left} = el.getBoundingClientRect();
  const {marginTop, marginLeft} = getComputedStyle(el);
  return {
    top: top - parseInt(marginTop, 10),
    left: left - parseInt(marginLeft, 10)
  };
}
