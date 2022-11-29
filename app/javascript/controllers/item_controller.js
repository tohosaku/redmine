import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="item"
export default class extends Controller {

  static targets = ['list']

  connect() {
    this.element[`${this.identifier}_controller`] = this
  }

  check(e) {
    if (e.currentTarget.checked) return;

    if (this.checkboxes.some(c => !c.checked)) {
      this.checkboxes.forEach(c => {
        if (!c.checked) {
          c.checked = true
        }
      });
      e.currentTarget.checked = true;
      e.preventDefault;
    } else {
      this.checkboxes.forEach(c => {
        if (c.checked) {
          c.checked = false
        }
      });
    }
  }

  get checkboxes() {
    if (this.hasListTarget) {
      const list = this.listTarget.list_controller;
      return list.checkboxes;
    } else {
      return [];
    }
  }
}
