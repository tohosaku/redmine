import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="projects--settings--members"
export default class extends Controller {
  static targets = ['roles', 'form']

  toggle(e) {
    e.preventDefault();

    this.rolesTarget.style.display = '';
    this.formTarget.replaceChildren();
  }
}
