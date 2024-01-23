import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="settings--repositories"
export default class extends Controller {

  keyword(e) {
    if (e.target.matches('a.delete-commit-keywords')) {
      e.preventDefault();

      const keywords = this.element.querySelectorAll('tbody tr.commit-keywords');

      if (keywords.length > 1) {
        e.target.closest('#commit-keywords tr').remove();
      } else {
        this.clear(keywords[0]);
      }
    }

    if (e.target.matches('a.add-commit-keywords')) {
      e.preventDefault();

      const rows = this.element.querySelectorAll('tr.commit-keywords');
      const last = rows.length - 1;
      const row  = rows[last];

      this.clear(row.clone().insertAfter(row));
    }
  }

  clear(element) {
    element.querySelectorAll('input, select').forEach(element => {
      element.value = ''
    });
  }
}
