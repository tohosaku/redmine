import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

// Connects to data-controller="select"
export default class extends Controller {

  static values = {
    url: String
  }

  update(e) {
    get(this.urlValue, {
      responseKind: 'turbo-stream',
      query: {
        [this.element.name]: this.element.value
      }
    });
  }
}
