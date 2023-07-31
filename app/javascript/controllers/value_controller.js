import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="value"
export default class extends Controller {
  connect() {
    const content = this.element.content.cloneNode(true)
    this.element.previousElementSibling.value = content.textContent
  }
}
