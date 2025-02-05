import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="link"
export default class extends Controller {
  visit(e) {
    const href = this.element.getAttribute('href');
    if (href) {
      Turbo.visit(href);
    }
  }
}
