import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="journals--edit"
export default class extends Controller {

  static targets = ['edit', 'notes', 'form', 'textarea']

  cancel(e) {
    e.preventDefault();

    this.formTarget.remove();
    this.notesTarget.style.display = '';
  }

  editTargetConnected(element) {
    this.notesTarget.style.display = 'none';

    if (this.hasFormTarget) {
      // journal edit form already loaded
      this.formTarget.style.display = 'block';
    } else {
      const node = element.content.cloneNode(true);
      this.notesTarget.after(node);
    }

    // Focus on the textarea
    if (this.hasTextareaTarget) {
      this.textareaTarget.focus();
      const textareaLength = this.textareaTarget.value.length;
      this.textareaTarget.setSelectionRange(textareaLength, textareaLength);
    }

    element.remove();
  }
}
