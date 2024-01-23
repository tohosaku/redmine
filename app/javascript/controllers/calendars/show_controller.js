import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="calendars--show"
export default class extends Controller {
  apply(e) {
    e.preventDefault();

    if (e.params.action) {
      this.element.setAttribute('action', e.params.action);
    }
    this.element.submit();
  }
}
