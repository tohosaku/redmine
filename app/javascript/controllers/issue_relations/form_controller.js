import Tribute from '@redmine-ui/tribute'
import { Controller } from "@hotwired/stimulus"
import { ajaxGet } from 'redmine'

// Connects to data-controller="issue-relations--form"
export default class extends Controller {
  static targets = ['field']
  static values = { path: String }

  connect() {
    this.multipleAutocompleteField(this.fieldTarget, this.pathValue);
    setPredecessorFieldsVisibility()
  }

  set(e) {
    setPredecessorFieldsVisibility()
  }

  multipleAutocompleteField(field, path, options) {

    if (field.classList.contains('autocomplete')) return;

    const tribute = new Tribute(Object.assign({
      autocompleteMode: true,
      menuShowMinLength: 2,
      noMatchTemplate: '',
      lookup: 'label',
      values: ajaxGet(field, (text) => `${path}&term=${text}`),
      selectTemplate: function(item) {
        if (typeof item === "undefined") return null;

        const terms = field.value.split(/,\s*/);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(item.original.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");

        field.value = terms.join(", ");
        return '';
      }
    }, options));
    tribute.attach(field);

    field.classList.add('autocomplete');
  }
}
