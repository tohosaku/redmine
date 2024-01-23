import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--editor"
export default class extends Controller {
  static targets = ['description']

  show(e) {
    e.preventDefault()

    e.currentTarget.style.display = 'none'
    this.descriptionTarget.style.display = '';
  }
}
