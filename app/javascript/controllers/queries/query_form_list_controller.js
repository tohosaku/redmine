import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--query-form-list"
export default class extends Controller {
  static targets = ['definition']

  toggle(e) {
    const element = e.target;

    if (element.matches('input[name=display_type]')) {
      if (element.value === 'list') {
        this.definitionTarget.classList.remove('hidden')
      } else {
        this.definitionTarget.classList.add('hidden')
      }
    }
  }
}
