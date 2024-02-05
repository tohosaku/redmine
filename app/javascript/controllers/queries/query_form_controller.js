import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--query-form"
export default class extends Controller {

  apply(e) {
    e.preventDefault();

    this.form.requestSubmit();
  }

  saveObject(e) {
    const query_type = this.form.querySelector('#query_type')
    query_type.disabled = false

    this.form.setAttribute('action', e.params.path)
    this.form.requestSubmit();
  }

  get form() {
    return this.element.closest('form#query_form');
  }
}
