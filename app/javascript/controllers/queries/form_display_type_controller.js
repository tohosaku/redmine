import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--form-display-type"
export default class extends Controller {
  static targets = ['element']

  changeDisplayType(e) {
    if (e.target.matches('input[name=display_type]')) {
      const option = $('input[name=display_type]:checked').val();
      const display = option == 'board' ? 'none' : ''
      this.elementTargets.forEach(e => e.style.display = display);
    }
  }
}
