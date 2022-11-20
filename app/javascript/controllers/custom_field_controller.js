import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

// Connects to data-controller="custom-field"
export default class extends Controller {
  static values = {
    url: String
  }

  format(e) {
    const args = {
      query: new FormData(this.element),
      responseKind: 'turbo-stream'
    };

    get(this.urlValue, args).then(response => {
      if (response.ok) {
        toggleDisabledInit();
      }
    })
  }
}

function toggleDisabledInit() {
  Array.from(document.querySelectorAll('input[data-disables], input[data-enables], input[data-shows]').forEach(element => {
    const checked = element.checked;
    document.querySelectorAll(element.dataset.disables).forEach(element => {
      element.disabled = checked;
    })
    document.querySelectorAll(element.dataset.enables).forEach(element => {
      element.disabled = !checked;
    })
    document.querySelectorAll(element.dataset.shows).forEach(element => {
      const display = element.style.display === '';
      element.style.display = display === checked ? '' : 'none';
    })
  }))
}
