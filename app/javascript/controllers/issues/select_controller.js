import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--select"
export default class extends Controller {
  static target = ['field']

  select(e) {
    e.preventDefault();

    Array.from(this.fieldTarget.options).forEach(o => {
      o.selected = (o.value === e.params.id)
    });
    this.fieldTarget.dispatchEvent(new Event('change'));
  }

  fieldTargetConnected(element) {
    const value = element.querySelector('option[selected=selected]').value;
    element.value = value;
  }
}
