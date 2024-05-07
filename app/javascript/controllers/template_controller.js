import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="template"
export default class extends Controller {
  static targets = ['element']

  elementTargetConnected(element) {
    const clone = element.content.cloneNode(true);
    this.element.prepend(clone);
    element.remove()
  }
}
