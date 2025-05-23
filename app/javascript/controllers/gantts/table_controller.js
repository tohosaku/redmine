import { Controller } from "@hotwired/stimulus"
import { jsonContent } from 'helper'

// Connects to data-controller="gantts--table"
export default class extends Controller {
  static targets = ['folder', 'area', 'today']
  static values = {columns: String}

  prepare() {
    window.issue_relation_type = jsonContent('issue_relation_type')
    this.invoke(gantt => {
      gantt.disableUnavailableColumns(this.columnsValue.split(','));
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.today, this.options);
      gantt.resizableSubjectColumn();
      gantt.drawSelectedColumns(this.options);
    })
  }

  draw(e) {
    this.invoke(gantt => {
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.today, this.options)
    })
  }

  redraw(e) {
    this.invoke(gantt => {
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.today, this.options)
      gantt.resizableSubjectColumn();
    })
  }

  toggle(e) {
    this.invoke(gantt => {
      gantt.ganttEntryClick(e)
      gantt.drawGanttHandler(this.folderTarget, this.areaTarget, this.today, this.options);
    })
  }

  get today() {
    if (this.hasTodayTarget) {
      return this.todayTarget;
    } else {
      return null;
    }
  }

  invoke(fn) {
    import('gantt').then(fn)
  }
}
