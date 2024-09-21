import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="account--form"
export default class extends Controller {
  keepAnchor(e) {
    let hash = decodeURIComponent(self.document.location.hash);
    if (hash) {
      if (hash.indexOf("#") === -1) {
        hash = "#" + hash;
      }
      this.element.action = this.element.action + hash;
    }
  }
}
