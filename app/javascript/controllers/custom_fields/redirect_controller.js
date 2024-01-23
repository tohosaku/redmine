import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="custom-fields--redirect"
export default class extends Controller {
  copy(e) {
    location.href = this.getURL(e.params.path, 'type')
  }

  add(e) {
    location.href = this.getURL(e.params.path, 'tab')
  }

  getURL(path, name) {
    const urlInfo = new URLInfo(path);
    const attr = document.querySelector('.tabs a.selected').getAttribute('id');
    const tab = attr.split('tab-').pop()
    urlInfo.setParam(name, tab)
    return urlInfo.toString()
  }
}
