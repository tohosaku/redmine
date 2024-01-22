import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--form-visibility"
export default class extends Controller {

  static targets = ['private','roles']

  connect() {
    this.setupRoles(this.rolesTarget.checked);
    this.setupPrivate(this.privateTarget.checked);
  }

  checkVisibility(e) {
    if (e.target.matches('input[name="query[visibility]"]')) {
      this.setupRoles(this.rolesTarget.checked);
      this.setupPrivate(this.privateTarget.checked);
    }
  }

  setupRoles(roles_checked) {
    const roles = this.element.querySelectorAll("input[name='query[role_ids][]'][type=checkbox]")
    roles.forEach((elem) => elem.disabled = !roles_checked)
  }

  setupPrivate(private_checked) {
    const private_elems   = document.querySelectorAll("input.disable-unless-private");
    if (!private_checked) {
      private_elems.forEach((elem) => elem.checked = false);
    }
    private_elems.forEach((elem) => elem.disabled = !private_checked);
  }
}
