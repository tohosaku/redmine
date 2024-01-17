import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="timelog--report"
export default class extends Controller {
  csv(e) {
    const form = e.target.form;
    ['encoding', 'field_separator'].forEach(key => {
      const value = this.element.querySelector(`select#${key}`).value
      form.querySelector(`input#${key}`).value = value
    })

    const action = form.getAttribute('action');
    form.setAttribute('action', e.params.csvpath);
    form.requestSubmit();
    form.setAttribute('action', action);
  }
}
