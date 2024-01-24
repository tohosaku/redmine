import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="gantts--table"
export default class extends Controller {

  toggle(e) {
    ganttEntryClick(e)
  }
}
