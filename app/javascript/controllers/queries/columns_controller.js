import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--columns"
export default class extends Controller {
  moveOptions(e) {
    const from    = e.target.form.querySelector(`#${e.params.from}`);
    const to      = e.target.form.querySelector(`#${e.params.to}`)
    const selected = from.selectedOptions[0];
    selected.selected = false;
    to.append(selected);
  }
}
