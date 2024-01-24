import { Controller } from "@hotwired/stimulus"
import { observeAutocomplete } from 'helper'

// Connects to data-controller="users--form"
export default class extends Controller {
  static targets = ['text', 'select']
  update(e) {
    const item = e.detail.item;

    this.updateUser(item);
    this.updateAuthSource(item.auth_source_id);
  }

  updateUser(item) {
    this.textTargets.forEach(element => {
      if (item[element.dataset.fieldname]) {
        element.value = item[element.dataset.fieldname];
      }
    })
  }

  updateAuthSource(auth_source_id) {
    for (const option of this.selectTarget.options) {
      if (option.value === auth_source_id) {
        option.selected = true;
        this.selectTarget.dispatchEvent(new Event('change'));
      }
    }
  }
}
