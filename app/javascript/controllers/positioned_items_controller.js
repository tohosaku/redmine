import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from '@rails/request.js'
import { withProgress } from 'helper'

// Connects to data-controller="positioned-items"
export default class extends Controller {
  update(e) {
    const handle = e.detail.querySelector('.sort-handle')
    const url    = handle.dataset.reorderUrl;
    const param  = handle.dataset.reorderParam;
    const data   = {[param]: { position: e.detail.dataset.sortedIndex }};

    const request = new FetchRequest('put', url, {
      body: data,
      responseKind: 'json'
    })
    withProgress(request.perform(), handle)
      .then(response => {
        if (!response.ok) {
          alert(response.statusCode);
          this.dispatch('cancel')
        }
      });
  }
}
