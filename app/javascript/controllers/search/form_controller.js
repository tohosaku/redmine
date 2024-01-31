import { Controller } from "@hotwired/stimulus"
import { toggleExpandCollapseIcon } from 'helper'

// Connects to data-controller="search--form"
export default class extends Controller {
  static values = { showOptions: Boolean }
  static targets = ['types', 'input', 'options', 'hidden']

  connect() {
    // showOptionsValue と hiddenTarget.value は同じことか??
    if (this.showOptionsValue) {
      toggleFieldset(this.optionsTarget);
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

function toggleFieldset(el) {
  const fieldset = el.closest('fieldset');
  fieldset.classList.toggle('collapsed');
  fieldset.querySelectorAll('legend').forEach(element => {
    toggleClass(element, 'icon-expanded', 'icon-collapsed');
  })
  toggleExpandCollapseIcon(fieldset.querySelector('legend'))
  fieldset.querySelectorAll('div').forEach(element => {
    if (element.style.display === '') {
      element.style.display = 'none';
    } else {
      element.style.display = '';
    }
  });
}
