import { Controller } from "@hotwired/stimulus"
import { toggleClass, toggleExpandCollapseIcon } from 'helper'

// Connects to data-controller="versions--sidebar"
export default class extends Controller {

  toggleClass(e) {
    toggleClass(e.currentTarget, 'icon-collapsed', 'icon-expanded');
    toggleExpandCollapseIcon(this.element);
  }
}
