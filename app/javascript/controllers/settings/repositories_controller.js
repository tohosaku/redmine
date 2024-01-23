import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="settings--repositories"
export default class extends Controller {

  keyword(e) {
    if (e.target.matches('a.delete-commit-keywords')) {
      e.preventDefault();

      if ($(this.element).find('tbody tr.commit-keywords').length > 1) {
        $(e.target).parents('#commit-keywords tr').remove();
      } else {
        $(this.element).find('tbody tr.commit-keywords').find('input, select').val('');
      }
    }

    if (e.target.matches('a.add-commit-keywords')) {
      e.preventDefault();

      const row = $(this.element).find('tr.commit-keywords:last');
      row.clone().insertAfter(row).find('input, select').val('');
    }
  }
}
