import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ["clear"];
  static values = {
    defaultclear: Boolean
  }

  connect() {
    if (this.defaultclearValue) {
      this.clear();
    }
  }


  clear(e) {
    this.clearTargets.forEach(elm => elm.value = '');
  }

  dummyTargetConnected(element) {
    this.clear();
    element.remove();
  }
}
