import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="radiobutton"
export default class extends Controller {
  forceCheck(e) {
    const radio = document.getElementById(e.params.id);
    radio.checked = true;
  }

  checkIfTrue(e) {
    const radio = document.getElementById(e.params.id);
    if (e.detail && e.detail.checked) {
      radio.checked = e.detail.checked;
    }
  }

  inspect(e) {
    this.dispatch('inspected', { detailed: { checked: e.currentTarget.checked}});
  }
}
