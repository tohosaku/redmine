/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'

// Connects to data-controller="imports--run"
export default class extends Controller {

  connect() {
    this.element.classList.add('ajax-loading');
    post(this.element.dataset.runpath, {
      responseKind: 'turbo-stream'
    });
  }
}
