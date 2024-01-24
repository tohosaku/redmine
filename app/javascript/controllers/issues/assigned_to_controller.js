import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--assigned-to"
export default class extends Controller {
  static targets = ['select', 'category']

  assignToMe(e) {
    e.preventDefault();

    const element = e.target;
    this.selectTarget.value = element.dataset.id;
    element.style.display = 'none';
  }

  categoryTargetConnected(element) {
    const option = this.selectTarget.querySelector('option')
    // Browsers prefer option[label] over inner text, so remove the blank label.
    option.removeAttribute('label')
    option.innerHTML = element.innerHTML
    element.remove();
  }
}
