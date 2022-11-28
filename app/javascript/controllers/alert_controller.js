import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="alert"
export default class extends Controller {

  connect() {
    alert(this.element.textContent);
    this.element.remove()
  }
}
