import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="serach--form"
export default class extends Controller {
  static values = { showOptions: Boolean }
  static targets = ['types', 'input', 'options', 'hidden']

  connect() {
    // showOptionsValue と hiddenTArget.value は同じことか??
    if (this.showOptionsValue) {
      toggleFieldset($(this.optionsTarget));
    }
  }

  submitForm(e) {
    e.preventDefault();
    const checkboxes = this.typesTarget.querySelectorAll('input[type=checkbox]')
    checkboxes.forEach((e) => e.removeAttribute('checked'));

    const checkbox = e.currentTarget.previousElementSibling;
    checkbox.setAttribute('checked', 'checked');
    if (this.inputTarget.value !== '') {
        this.element.requestSubmit();
    }
  }

  setVisibilityOfOptions(e) {
    const showOptions = this.optionsTarget.style.display !== 'none' ? '1' : '0';
    this.hiddenTarget.value = showOptions;
  }
}
