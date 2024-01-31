import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'
import { observeAutocomplete } from 'redmine'

// Connects to data-controller="timelog--bulk-edit-issue"
export default class extends Controller {
  static values = { url: String, project: String }
  static targets = [ 'field', 'select', 'projectId' ];

  connect() {
    observeAutocomplete(this.fieldTarget, this.getUrl, this.options);
  }

  getUrl(term) {
    const params = new URLSearchParams({
      term: term
    });
    let project_id;
    if (this.projectValue !== '') {
      project_id = this.projectValue
    }

    const current_project_id = this.projectIdTarget.value;
    if(current_project_id !== ''){
      params.set('project_id', current_project_id)
    } else {
      params.set('project_id', project_id)
    }
    const urlstr = this.urlValue.split('?');

    return urlstr.length == 1 ? `${this.urlValue}?${params.toString}`
                            : `${urlstr[0]}?${urlstr[1]}&${params.toString}`;
  }

  get options() {
    return {
      select: (event, ui, data) => {
        $(this.selectTarget).text(ui.item.label);
      }
    }
  }

  clear(e) {
    if (e.target.matches('#time_entry_project_id')) {
      $('#time_entry_issue_id').val('');
      $('#time_entry_issue').text('');
    }
  }
}
