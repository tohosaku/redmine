import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="journals--new"
export default class extends Controller {

  static targets = ['new', 'text', 'private']

  newTargetConnected(element) {
    showAndScrollTo('update');

    let notes = this.textTarget.value;
    if (notes > '') { notes = notes + "\n\n"}

    const node = element.content.cloneNode(true)
    this.setContent(notes + node.textContent);

    // when quoting a private journal, check the private checkbox
    const is_private = element.dataset.journalPrivate;
    if (is_private && this.hasPrivateTarget) {
      this.privateTarget.checked = true;
    }
    element.remove();
  }

  setContent(value) {
    this.textTarge.blur();
    this.textTarget.focus();
    this.textTarget.value = value;
  }
}
