import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="workflows--permissions"
export default class extends Controller {
  select(e) {
    e.preventDefault();
    const $td = $(this.element);
    const selected = $td.find("select").find(":selected").val();
    $td.nextAll('td').find("select").val(selected);
  }
}
