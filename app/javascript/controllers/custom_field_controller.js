import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

// Connects to data-controller="custom-field"
export default class extends Controller {
  static values = {
    url: String
  }

  async format(e) {
    const args = {
      query: new FormData(this.element),
      responseKind: 'turbo-stream'
    };
    const response = await get(this.urlValue, args);
    if (response.ok) {
      toggleDisabledInit();
    }
  }
}
