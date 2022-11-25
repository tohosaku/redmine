import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ["clear"];

  clear(e) {
    this.clearTarget.value = '';
  }
}
