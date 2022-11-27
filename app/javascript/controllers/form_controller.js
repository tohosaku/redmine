import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'

// Connects to data-controller="form"
export default class extends Controller {
  static targets = ['select']

  static values = {
    url: String
  }

  update(event) {
    post(this.urlValue, {
      body: new FormData(this.element),
      responseKind: 'turbo-stream'
    });
  }

  submit(event) {
    this.element.requestSubmit();
  }

  selectTargetConnected(element) {
    this.element.removeAttribute('data-submitted');
  }
}
