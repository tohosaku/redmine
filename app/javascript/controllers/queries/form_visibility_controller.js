import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--form-visibility"
export default class extends Controller {

  static targets = ['radio','role']

  connect() {
    const checked = this.radioTargets.find(radioButton => radioButton.checked)
    if (typeof checked !== 'undefined') {
      this.setupRoles(checked.value);
      this.setupPrivate(checked.value);
    }
  }

  checkVisibility(e) {
    if (this.radioTargets.some(radioButton => e.target === radioButton)) {
      this.setupRoles(e.target.value);
      this.setupPrivate(e.target.value);
    }
  }

  setupRoles(value) {
    const rolesChecked = value === '1'
    this.roleTargets.forEach((elem) => (elem.disabled = !rolesChecked))
  }

  setupPrivate(value) {
    const privateChecked = value === '0'
    const private_elems   = document.querySelectorAll("input.disable-unless-private");
    if (!privateChecked) {
      private_elems.forEach((elem) => elem.checked = false);
    }
    private_elems.forEach((elem) => elem.disabled = !privateChecked);
  }
}
