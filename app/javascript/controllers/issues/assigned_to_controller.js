import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--assigned-to"
export default class extends Controller {
  static targets = ['select', 'link', 'category']

  assignId(e) {
    if (this.hasLinkTarget) {
      const user_id = event.target.value;
      const current_user_id = this.linkTarget.dataset.id;

      if (user_id === current_user_id) {
        this.linkTarget.style.display = 'none'
      } else {
        this.linkTarget.style.display = ''
      }
    }
  }

  assignToMe(e) {
    e.preventDefault();

    const element = e.target;
    this.selectTarget.value = element.dataset.id;
    element.style.display = 'none';
  }

  categoryTargetConnected(element) {
    const option = this.selectTarget.querySelector('option')
    option.innerHTML = element.innerHTML
    element.remove();
  }
}
