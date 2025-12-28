/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="command"
export default class extends Controller {
  execute(e) {
    e.preventDefault();
    this.dispatch(e.params.name);
  }
}
