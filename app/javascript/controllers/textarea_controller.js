import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="textarea"
export default class extends Controller {

  // Submit the form with Ctrl + Enter or Command + Return
  submit(e) {
    const textarea = e.target
    const form = e.target.closest('form');

    if (form !== null) {
      textarea.blur();
      delete textarea.dataset.changed
      form.requestSubmit();
    }
  }

  markAsChanged(e) {
    e.target.dataset.changed = 'changed'
  }
}
