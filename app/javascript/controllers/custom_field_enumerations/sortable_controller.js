import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="custom-field-enumerations--sortable"
export default class extends Controller {
  update(e) {
    this.element.querySelectorAll('li').forEach((li, index) => {
      li.querySelector('input.position').value = index + 1
    })
  }
}
