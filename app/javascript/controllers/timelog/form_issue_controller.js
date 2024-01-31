import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'
import { observeAutocomplete } from 'redmine'

// Connects to data-controller="timelog--form-issue"
export default class extends Controller {
  static values = { url: String, project: String }
  static targets = [ 'field', 'select' ];

  connect() {
    observeAutocomplete(this.fieldTarget, this.getUrl, this.options);
  }

  getUrl(term) {
    const params = new URLSearchParams({
      term: term
    });

    const project_id = this.projectValue === '' ? this.fieldTarget.value
                                                : this.projectValue;
    if(project_id){
      params.set('project_id', project_id);
    } else {
      params.set('scope', 'all');
    }

    const urlstr = this.urlValue.split('?');

    return urlstr.length == 1 ? `${this.urlValue}?${params.toString}`
                              : `${urlstr[0]}?${urlstr[1]}&${params.toString}`;
  }

  get options() {
    return {
      select: (event, ui) => {
        const $field = $(this.fieldTarget);
        $(this.selectTarget).text('');
        $field.val(ui.item.value).change();
      }
    }
  }
}
