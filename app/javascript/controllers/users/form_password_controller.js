import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="users--form-password"
export default class extends Controller {
  static targets = ['password']

  init(e) {
    this.setPasswordField(e.currentTarget.checked)
  }

  setPasswordField(checked) {
    this.passwordTargets.forEach(target => {
      if (checked){
        target.value = '';
      }
      target.disabled = checked;
    })
  }
}
