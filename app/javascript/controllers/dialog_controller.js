/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dialog"
export default class extends Controller {
  static targets = [ 'handler' ]

  connect() {
    this.dragging = null;
    this.backdrop = null;
    const rect = this.element.getBoundingClientRect();
    this._pos = {x: rect.left, y: rect.top}
    this.element[`${this.identifier}_controller`] = this;
  }

  noop(e) {
    e.preventDefault()
  }

  start(e) {
    if (e.button !== 0) return; // left button only

    const client = this.eventToCoordinates(e);
    this.dragging = {dx: this.pos.x - client.x, dy: this.pos.y - client.y};
    this.handlerTarget.classList.add('dragging');
    this.handlerTarget.setPointerCapture(e.pointerId);
    this.handlerTarget.style.userSelect = 'none'; // if there's text
    this.handlerTarget.style.webkitUserSelect = 'none'; // safari
  }

  end(e) {
    this.dragging = null;
    this.handlerTarget.classList.remove('dragging');
    this.handlerTarget.style.userSelect = ''; // if there's text
    this.handlerTarget.style.webkitUserSelect = ''; // safari
  }

  move(e) {
    if (!this.dragging) return;

    const client = this.eventToCoordinates(e);
    this.pos = {x: client.x + this.dragging.dx, y: client.y + this.dragging.dy};
  }

  eventToCoordinates(e) {
    return {x: e.clientX, y: e.clientY}
  }

  get pos() { return this._pos }

  set pos(p) {
    this._pos = p;
    this.element.style.transform = `translate(${this._pos.x}px,${this._pos.y}px)`;
  }

  show({width = undefined, backdrop = 'modal-backdrop'}) {
    this.element.style.display = '';
    if (width) {
      this.element.style.width = width;
    }
    this.backdrop = document.getElementById(backdrop)
    this.backdrop.classList.add('modal-backdrop-open')
    this.wrapper = document.getElementById('wrapper')
    this.wrapper.inert = true
  }

  hide(e) {
    this.hideDialog()
  }

  cancel(e) {
    e.preventDefault();
    this.hideDialog()
  }

  hideDialog() {
    this.element.style.display = 'none'
    if (this.backdrop !== null) {
      this.backdrop.classList.remove('modal-backdrop-open')
      this.wrapper.inert = false
    }
  }
}
