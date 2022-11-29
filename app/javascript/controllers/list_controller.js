import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="list"
export default class extends Controller {

  static targets = ['checkbox', 'item']

  connect() {
    this.element[`${this.identifier}_controller`] = this
  }

  get checkboxes () {
    const array = []
    this.itemTargets.forEach(t => {
      const item = t.item_controller;
      item.checkboxes.forEach(c => array.push(c));
    })
    this.checkboxTargets.forEach(c => array.push(c));
    return array;
  }
}
