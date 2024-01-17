import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="timelog--report"
export default class extends Controller {
  csv(e) {
    $('form input#encoding').val($('select#encoding option:selected').val());
    $('form#query_form').attr('action', e.param.csvpath).submit();
    $('form#query_form').attr('action', e.param.path);
  }
}
