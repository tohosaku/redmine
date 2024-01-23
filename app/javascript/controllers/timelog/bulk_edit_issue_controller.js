import { Controller } from "@hotwired/stimulus"
import { observeAutocomplete, URLInfo } from 'helper'

// Connects to data-controller="timelog--bulk-edit-issue"
export default class extends Controller {
  static values = { url: String, project: { type: String, default: undefined }}
  static targets = [ 'field', 'select', 'projectId' ];

  connect() {
    const source = getSource(this.urlValue, this.projectValue, this.projectIdTarget);
    observeAutocomplete(this.fieldTarget, source);
  }

  replace(e) {
    const label = e.detail.item.original.label;
    this.selectTarget.textContent = label;
  }
}

function getSource(url, project, element) {
  return (term) => {
    const urlInfo = new URLInfo(url);
    urlInfo.setParam('term', term)

    const current_project_id = element.value;

    const value = current_project_id !== '' ? current_project_id
                                            : project;
    urlInfo.setParam('project_id', value)

    return urlInfo.toString()
  }
}
