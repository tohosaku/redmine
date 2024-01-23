import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="custom-fields--redirect"
export default class extends Controller {
  copy(e) {
    location.href = `${e.params.path}&type=${this.getUri()}`
  }

  add(e) {
    location.href = `${e.params.path}?tab=${this.getUri()}`
  }

  getUri() {
    return encodeURIComponent(($('.tabs a.selected').attr('id')||'').split('tab-').pop())
  }
}
