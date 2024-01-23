import { Controller } from "@hotwired/stimulus"
import { observeAutocomplete, URLInfo } from 'helper'

// Connects to data-controller="timelog--form-issue"
export default class extends Controller {
  static values = { url: String, project: { type: String, default: undefined }}
  static targets = [ 'field', 'select', 'projectId' ];

  connect() {
    const source = getSource(this.urlValue, this.projectValue, this.projectIdTarget);
    observeAutocomplete(this.fieldTarget, source);
  }

  replace(e) {
    this.selectTarget.textContent = '';
    const item = e.detail.item
    this.fieldTarget.value = item.original.value;
    const event = new Event('change');
    this.fieldTarget.dispatchEvent(event);
  }
}

function getSource(url, project, element) {
  return (term) => {
    const urlInfo = new URLInfo(url);
    urlInfo.setParam('term', term)

    const value = typeof project === 'undefined' ? element.value
                                                 : project;
    if (value) {
      urlInfo.setParam('project_id', value)
    } else {
      urlInfo.setParam('scope', 'all')
    }
    return urlInfo.toString()
  }
}
