import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="collapse"
export default class extends Controller {
  /* see: https://codepen.io/ddryo-the-encoder/pen/bGMZzMR */
  fade(e) {
    const animationTime = 250;
    const offsetTime = 5;

    e.preventDefault();
    if (!this.element.open) {
      this.element.open = true;
      setTimeout(() => {
        this.element.classList.add('is-opened');
      }, offsetTime);
    } else if (this.element.open) {
      this.element.classList.remove('is-opened');
      setTimeout(() => {
        this.element.open = false;
      }, animationTime + offsetTime);
    }
  }

  ensure(e) {
    const hasOpenedClass = this.element.classList.contains('is-opened');

    if (this.element.open && !hasOpenedClass) {
      this.element.classList.add('is-opened');
    } else if (!this.element.open && hasOpenedClass) {
      this.element.classList.remove('is-opened');
    }
  }
}
