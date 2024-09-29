import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

// Connects to data-controller="select"
export default class extends Controller {

  check(e) {
    if (this.element.dataset.condition) {
      const matched = this.element.value === this.element.dataset.condition;
      this.dispatch('selected', {detail: {matched: matched}})
    }
  }
}
