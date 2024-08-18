/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"
import { jsonContent, isMobile } from "helper"
import { WcDatepicker } from "wc-datepicker";

if (!customElements.get("wc-datepicker")) {
  customElements.define("wc-datepicker", WcDatepicker);
}

// Connects to data-controller="datepicker"
export default class extends Controller {
  static targets = ['input', 'picker']

  connect() {
    if (this.isMobile && this.isNativeSupported) return;

    this.inputTarget.readOnly = true
    const template = document.getElementById('datepicker-template');

    this.element.append(template.content.cloneNode(true).firstElementChild)
  }

  select(e) {
    this.setDate(e.detail)
    this.pickerTarget.style.display = 'none'
  }

  close(e) {
    if (e.type === 'click' && (e.target.closest('wc-datepicker') != null || e.target === this.inputTarget)) {
      return;
    }

    this.pickerTarget.style.display = 'none'
  }

  dispatch(e) {
    if (this.isMobile && this.isNativeSupported) return;

    this.pickerTarget.style.display  = '';

    // Since the height of the datepicker is referenced to determine the position,
    // it is necessary to get the position after it is displayed.
    const { top, left } = this.position;

    this.pickerTarget.style.top      = `${top}px`
    this.pickerTarget.style.left     = `${left}px`
    this.pickerTarget.style.opacity  = 1;

    if (this.inputTarget.value !== '') {
      this.pickerTarget.value = new Date(this.inputTarget.value)
    }
  }

  pickerTargetConnected(element) {
    element.setAttribute('style', 'display: none; opacity: 0')
    element.style.position = 'fixed'
    const config = jsonContent('datepicker-labels')
    element.labels = config.labels
    element['first-day-of-week'] = config['first-day-of-week']
  }

  setDate(value) {
    this.inputTarget.value = value;
  }

  get position() {
    const prect = this.pickerTarget.getBoundingClientRect();
    const rect  = this.inputTarget.getBoundingClientRect();

    const cheight = document.documentElement.clientHeight;
    const cwidth  = document.documentElement.clientWidth;

    const top = (cheight - rect.bottom) > prect.height ? rect.bottom + 5
                                                       : rect.top    - prect.height - 5
    const left = rect.left

    return { top, left }
  }

  // detect if native date input is supported
  get isNativeSupported() {
    const input = document.createElement('input');
    input.setAttribute('type','date');
    if (input.type === 'text') {
      return false;
    }

    const notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);
    if (input.value === notADateValue) {
      return false;
    }

    return true;
  }

  get isMobile() {
    return isMobile();
  }
}
