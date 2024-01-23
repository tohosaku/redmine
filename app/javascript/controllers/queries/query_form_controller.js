import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--query-form"
export default class extends Controller {

  apply(e) {
    const form = document.getElementById('query_form');
    form.requestSubmit();
  }

  saveObject(e) {
    $('#query_type').prop('disabled',false);
    $('#query_form').attr('action', e.params.path).submit()
  }
}
