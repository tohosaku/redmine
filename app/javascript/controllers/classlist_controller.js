import { Controller } from "@hotwired/stimulus"
import { toBoolean } from "dom"

// Connects to data-controller="classlist"
export default class extends Controller {
  static targets = ['dummy']

  dummyTargetConnected(element) {
    const force = toBoolean(element.dataset.force);

    this.element.classList.toggle(element.dataset.css, force);
    element.remove();
  }
}
