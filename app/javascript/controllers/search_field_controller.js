import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"
import { withProgress } from 'helper'

// Connects to data-controller="search-field"
export default class extends Controller {

  static values = {
    url: String
  };

  connect() {
    this.element.classList.add('autocomplete');
    this.was = this.element.value;
  }

  request() {
    const val = this.element.value;
    if (this.was != val){
      this.was = val;
      const options = {
        'query': { 'q': val },
        'responseKind': 'turbo-stream'
      };
      const request = new FetchRequest('get', this.urlValue, options)
      return withProgress(request.perform(), this.element)
    }
  }

  get was() {
    return this.element.dataset.valueWas;
  }

  set was(val) {
    this.element.dataset.valueWas = val;
  }

  check(e) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.request()
    }, 300)
  }
}

