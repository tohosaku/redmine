import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="focus"
export default class extends Controller {

  static targets = ['point', 'dummy']

  focus(e) {
    if (this.hasPointTarget) {
      if (e.detail.visible) {
        this.pointTarget.focus();
      } else {
        e.detail.source.blur();
      }
    }
  }

  focusIfTrue(e) {
    const element = document.getElementById(e.params.id)
    if (e.detail && e.detail.checked) {
      element.focus();
    }
  }

  dummyTargetConnected(element) {
    this.pointTarget.focus();
    element.remove();
  }
}
