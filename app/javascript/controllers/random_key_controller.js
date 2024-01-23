import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="random-key"
export default class extends Controller {
  static targets = ['field']
  static values  = {
    length: { type: Number, default: 20 }
  }

  generate(e) {
    if (!this.fieldTarget.disabled) {
      this.fieldTarget.value = randomKey(this.lengthValue);
    }
  }
}
