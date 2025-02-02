import { Controller } from "@hotwired/stimulus"
import { jsonContent } from 'helper'

// Connects to data-controller="gantts--table"
export default class extends Controller {
  static targets = ['folder', 'area', 'today']
  static values = {columns: String}

  connect() {
    this.prepare();
  }

  prepare(e) {
    window.issue_relation_type = jsonContent('issue_relation_type')
    this.invoke(gantt => {
      gantt.disableUnavailableColumns(this.columnsValue.split(','));
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.todayTarget);
      gantt.resizableSubjectColumn();
      gantt.drawSelectedColumns();
    })
  }

  draw(e) {
    this.invoke(gantt => {
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.todayTarget)
    })
  }

  redraw(e) {
    this.invoke(gantt => {
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.todayTarget)
      gantt.resizableSubjectColumn();
    })
  }

  toggle(e) {
    this.invoke(gantt => {
      gantt.ganttEntryClick(e)
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.todayTarget);
    })
  }

  invoke(fn) {
    import('gantt').then(fn)
  }
}
