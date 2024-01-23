import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="attributes"
export default class extends Controller {
  set(e) {
    const item = e.params.item;
    Object.keys(item).forEach(key => {
      this.element.setAttribute(key, item[key]);
    })
  }
}
