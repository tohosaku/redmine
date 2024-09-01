import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="focus"
export default class extends Controller {

  static targets = ['point']

  focus(e) {
    if (this.hasPointTarget) {
      if (e.detail.visible) {
        this.pointTarget.focus();
      } else {
        e.detail.source.blur();
      }
    }
  }
}
