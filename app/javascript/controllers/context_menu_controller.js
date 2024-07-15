import { Controller } from "@hotwired/stimulus"
import { unselectAll, click, rightClick, toggleIssuesSelection } from 'context_menu'

// Connects to data-controller="context-menu"
export default class extends Controller {

  connect() {
    unselectAll();
  }

  show(e) {
    rightClick(e);
  }

  hide(e) {
    click(e);

    if (e.target.matches('.js-contextmenu')) {
      rightClick(e);
    }
  }

  toggle(e) {
    if (e.target.matches('input[type=checkbox].toggle-selection')) {
      toggleIssuesSelection(e);
    }
  }
}
