/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"
import Tablesort from 'tablesort';
import numberPlugin from 'tablesort.number';

Tablesort.extend(numberPlugin.name, numberPlugin.pattern, numberPlugin.sort);

// Connects to data-controller="tablesort"
export default class extends Controller {
  connect() {
    if (typeof Tablesort === 'undefined') return;

    new Tablesort(this.element);
  }
}
