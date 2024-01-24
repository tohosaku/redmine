import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="gantts--show"
export default class extends Controller {
  static values = {columns: String}

  connect() {
    this.prepare();
  }

  prepare(e) {
    if (typeof drawGanttHandler !== 'undefined') {
      const issue_relation_type = JSON.parse(document.getElementById('issue_relation_type').textContent)
      disable_unavailable_columns(this.columnsValue.split(','));
      drawGanttHandler();
      resizableSubjectColumn();
      drawSelectedColumns();
    }
  }

  draw(e) {
    drawGanttHandler(e)
  }

  redraw(e) {
    drawGanttHandler();
    resizableSubjectColumn();
  }

  apply(e) {
    e.preventDefault();

    this.element.requestSubmit();
  }

  saveObject(e) {
    e.preventDefault();

    this.element.setAttribute('action', e.params.path);
    this.element.requestSubmit();
  }
}
