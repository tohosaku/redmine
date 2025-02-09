import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="button"
export default class extends Controller {
  click(e) {
    e.preventDefault();
    this.dispatch('click');
  }
}
