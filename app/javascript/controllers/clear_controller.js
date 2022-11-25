import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ["clear", 'child', 'dummy'];

  clear(e) {
    this.clearTargets.forEach(elm => elm.value = '');
    this.childTargets.forEach(elm => elm.replaceChildren());
  }

  dummyTargetConnected(element) {
    this.clear();
    element.remove();
  }
}
