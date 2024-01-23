import { Controller } from "@hotwired/stimulus"
import { observeAutocomplete } from 'redmine'

// Connects to data-controller="observe-autocomplete-field"
export default class extends Controller {
  static values = { path: String }

  connect() {
    observeAutocomplete(this.element, this.pathValue)
  }
}
