import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ["clear"];

  clear(e) {
    this.clearTargets.forEach(elm => elm.value = '');
  }

  dummyTargetConnected(element) {
    this.clear();
    element.remove();
  }
}
