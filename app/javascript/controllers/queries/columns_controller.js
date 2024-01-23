import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--columns"
export default class extends Controller {
  moveOptions(e) {
    const from_id = e.params.from;
    const to_id   = e.params.to;
    moveOptions(this.element.form[from_id], this.element.form[to_id]);
  }
}
