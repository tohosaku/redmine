/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="draggable"
export default class extends Controller {
  static targets = ['handle']

  connect() {
    this.startPosition = null;
  }

  start(e) {
    this.startPosition = this.eventToCoordinates(e);
    if (this.hasHandleTarget) {
      this.handleTarget.setPointerCapture(e.pointerId);
    } else {
      this.element.setPointerCapture(e.pointerId);
    }
  }

  move(e) {
    if (!this.startPosition) return;

    const currentPosition = this.eventToCoordinates(e);
    this.element.style.transform = this.getTranslate(currentPosition);
  }

  end(e) {
    this.startPosition = null;
  }

  getTranslate(currentPosition) {
    return `translate(${currentPosition.x - this.startPosition.x }px,${currentPosition.y - this.startPosition.y}px)`;
  }

  eventToCoordinates(e) {
    if (e.detail) {
      return {x: e.detail.clientX, y: e.detail.clientY}
    } else {
      return {x: e.clientX, y: e.clientY}
    }
  }

  // Reset the position to drag again
  ensurePosition(e) {
    const rect = this.element.getBoundingClientRect();
    this.element.style.transform = null;
    this.element.style.top = `${rect.top}px`
    this.element.style.left = `${rect.left}px`
  }
}
