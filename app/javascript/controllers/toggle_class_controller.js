import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle-class"
export default class extends Controller {

  static targets = ['input']
  static classes = ['klass']

  toggleClass(e) {
    this.invoke(e.currentTarget);
  }

  inputTargetConnected(element) {
    this.invoke(element);
  }

  invoke(element) {
    this.element.classList.toggle(this.klassClass, element.checked);
  }
}
