import { Controller } from "@hotwired/stimulus"
import { setDisplay } from "helper"

// Connects to data-controller="issue-relations--form"
export default class extends Controller {
  static targets = ['predecessor', 'select']
  static values  = {'condition': Array}

  connect() {
    this.setPredecessorFieldsVisibility()
  }

  set(e) {
    this.setPredecessorFieldsVisibility()
  }

  get isMatched() {
    const value = this.selectTarget.value
    return this.conditionValue.includes(value)
  }

  setPredecessorFieldsVisibility() {
    setDisplay(this.predecessorTarget, this.isMatched)
  }
}
