import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="versions--sidebar"
export default class extends Controller {
  static target = ['completed'];

  toggle(e) {
    $(e.currentTarget).toggleClass("icon-collapsed icon-expanded");
    $(this.completedTarget).toggle()
  }
}
