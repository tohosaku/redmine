import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tab-buttons"
export default class extends Controller {
  left(e) {
    e.preventDefault();
    moveTabLeft(e.currentTarget)
  }

  right(e) {
    e.preventDefault();
    moveTabRight(e.currentTarget)
  }
}
