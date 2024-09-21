import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="auth-sources--ldap"
export default class extends Controller {
  clear(e) {
    this.element.value = ''
  }

  setName(e) {
    this.element.name = e.params.name
  }
}
