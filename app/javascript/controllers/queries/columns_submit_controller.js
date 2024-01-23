import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--columns-submit"
export default class extends Controller {
  connect() {
    // see https://www.betterstimulus.com/events.html
    this.boundDisableOptions = this.disableOptions.bind(this)
    this.element.form.addEventListener('submit', this.boundDisableOptions)
  }

  disconnect() {
    this.element.form.removeEventListener('submit', this.boundDisableOptions)
  }

  disableOptions(e) {
    $(this.element).find('option:not(:disabled)').prop('selected', true);
  }
}
