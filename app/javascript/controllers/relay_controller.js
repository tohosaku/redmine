/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from '@hotwired/stimulus'

export default class RelayController extends Controller {
  forward (e) {
    const subscribers = this.element.querySelectorAll(`[data-relay-events*='${e.type}']`)

    subscribers.forEach(el => {
      el.dispatchEvent(new CustomEvent(e.type, {
        detail: e.detail,
        params: e.params
      }))
    })
  }
}
