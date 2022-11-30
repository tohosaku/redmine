import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="journals--update"
export default class extends Controller {

  static targets = ['update', 'header', 'update_info']

  updateTargetConnected(element) {
    this.element.className = element.getAttribute('css_classes');
    const update_info = element.content.cloneNode(true)

    if (this.hasUpdateInfoTarget) {
      this.updateInfoTarget.replaceWith(update_info);
    } else {
      this.headerTarget.append(update_info);
    }
    setupWikiTableSortableHeader();
    element.remove();
  }
}
