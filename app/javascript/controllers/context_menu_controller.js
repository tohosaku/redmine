import { Controller } from "@hotwired/stimulus"
import { Menu, unselectAll, click, rightClick, toggleIssuesSelection } from 'context_menu'

// Connects to data-controller="context-menu"
export default class extends Controller {

  connect() {
    this.menu = new Menu(this.element);
    unselectAll();
  }

  show(e) {
    rightClick(this.menu, e);
  }

  hide(e) {
    click(this.menu, e);

    if (e.target.matches('.js-contextmenu')) {
      rightClick(this.menu, e);
    }
  }

  toggle(e) {
    if (e.target.matches('input[type=checkbox].toggle-selection')) {
      toggleIssuesSelection(e);
    }
  }
}
