import { Controller } from "@hotwired/stimulus"
import { nextAll } from 'helper'

// Connects to data-controller="workflows--permissions"
export default class extends Controller {
  static targets = ['permission']

  select(e) {
    e.preventDefault();
    const selected = this.permissionTarget.value;
    nextAll(this.element, 'td').forEach(elm => {
      elm.querySelector("select").value = selected
    });
  }
}
