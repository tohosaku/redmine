/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="table-generator"
export default class extends Controller {

  addMenu(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const alphabets = this.element.dataset.alphabets.split('');
    this.element.addMenu(alphabets.slice(0, col), row);
  }

  selectCell(e) {
    const hoverRow = parseInt(e.target.dataset.row);
    const hoverCol = parseInt(e.target.dataset.col);

    e.currentTarget.querySelectorAll('td').forEach(element => {
      if (parseInt(element.dataset.row) <= hoverRow && parseInt(element.dataset.col) <= hoverCol) {
        element.classList.add('selected-cell');
      } else {
        element.classList.remove('selected-cell');
      }
    })
  }

  remove(e) {
    this.element.remove();
  }

  removeWhenOutside(e) {
    if (!e.target.matches('.jstb_table') && !this.element.contains(e.target)) {
      this.remove();
    }
  }
}
