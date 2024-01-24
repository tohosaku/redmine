import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'

// Connects to data-controller="issue"
export default class extends Controller {

  static values = {
    url: String
  }

  static targets = ["form", "category", "attribute", "trigger"]

  update(e) {
    this.allAttributes.forEach(element => {
      element.dataset.valuebeforeupdate = element.value
    });
    if (e.currentTarget) {
      this.triggerTarget.value = e.currentTarget.id
    }

    return post(this.urlValue, {
      body: new FormData(this.element),
      responseKind: 'turbo-stream'
    });
  }

  replace(replacement) {
    this.allAttributes.forEach(element => {
      const object_id = element.id;
      if (object_id && element.dataset.valuebeforeupdate != element.value) {
        replacement.querySelector('#'+object_id).value = element.value;
      }
    });
    this.attributeTarget.innerHTML = ''
    this.attributeTarget.append(replacement)
  }

  get allAttributes() {
    return this.attributeTarget.querySelectorAll("input, textarea, select")
  }

  formTargetConnected(element) {
    const clone = element.content.cloneNode(true);
    this.replace(clone);
    element.remove();
  }
}
