import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--select"
export default class extends Controller {
  static target = ['field']

  select(e) {
    e.preventDefault();

    this.fieldTarget.querySelectorAll('option').forEach(o => {o.selected = false});
    this.fieldTarget.querySelector(`option[value="${e.params.id}"]`).selected = true
    this.fieldTarget.dispatchEvent(new Event('change'));
  }

  fieldTargetConnected(element) {
    const $element = $(element);
    const value = $element.find("option[selected=selected]").val();
    $element.val(value);
  }
}
