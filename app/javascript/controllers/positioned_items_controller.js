import { Controller } from "@hotwired/stimulus"
import { put } from '@rails/request.js'

// Connects to data-controller="positioned-items"
export default class extends Controller {
  static values = {option: Object}

  update(e) {
    const handle = e.detail.querySelector('.sort-handle')
    handle.classList.add('ajax-loading');
    const url = handle.dataset.reorderUrl;
    const param = handle.dataset.reorderParam;
    const data = {};
    data[param] = { position: e.detail.dataset.sortedIndex };

    put(url, {
      body: data,
      responseKind: 'json'
    })
      .then(response => {
        if (!response.ok) {
          alert(response.statusCode);
          this.dispatch('cancel')
        }
      })
      .finally(() => handle.classList.remove('ajax-loading'))
  }
}
