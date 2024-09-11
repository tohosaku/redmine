import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="classlist"
export default class extends Controller {
  static targets = ['dummy']

  dummyTargetConnected(element) {
    let force = element.dataset.force;

    force = force === 'true' ? true
                             : force === 'false' ? false
                                                 : undefined;
    this.element.classList.toggle(element.dataset.css, force);
    element.remove();
  }
}
