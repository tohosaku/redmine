/**
 * Copyright (C) 2024- Justin Searls
 * copied from https://justin.searls.co/posts/a-decoupled-approach-to-relaying-events-between-stimulus-controllers/
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
