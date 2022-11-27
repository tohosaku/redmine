import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="custom-field-enumerations--sortable"
export default class extends Controller {
  static target = ['position']

  update(e) {
    this.positionTargets.forEach((element, index) => {
      element.value = index + 1
    })
  }
}
