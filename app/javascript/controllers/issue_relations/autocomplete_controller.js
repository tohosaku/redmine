import { Controller } from "@hotwired/stimulus"
import Tribute from '@redmine-ui/tribute'
import { createQuery } from 'helper'

// Connects to data-controller="issue-ralations--autocomplete"
export default class extends Controller {
  static values = { path: String }

  connect() {
    if (this.element.classList.contains('autocomplete')) return;

    const tribute = new Tribute({
      autocompleteMode: true,
      menuShowMinLength: 2,
      noMatchTemplate: '',
      lookup: 'label',
      values: createQuery(this.element, this.pathValue),
      selectTemplate: (item) => {
        if (typeof item === "undefined") return null;

        const terms = this.element.value.split(/,\s*/);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(item.original.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");

        this.element.value = terms.join(", ");
        return '';
      }
    });
    tribute.attach(this.element);

    this.element.classList.add('autocomplete');
  }
}
