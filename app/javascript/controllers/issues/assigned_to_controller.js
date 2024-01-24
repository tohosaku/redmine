import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="issues--assigned-to"
export default class extends Controller {
  static targets = ['select', 'link', 'category']

  assignId(e) {
    const assign_to_me_link = $(this.linkTarget);

    if (assign_to_me_link.length > 0) {
      var user_id = $(event.target).val();
      var current_user_id = assign_to_me_link.data('id');

      if (user_id == current_user_id) {
        assign_to_me_link.hide();
      } else {
        assign_to_me_link.show();
      }
    }
  }

  assignToMe(e) {
    e.preventDefault();

    const $element = $(e.target);
    $(this.selectTarget).val($element.data('id'));
    $element.hide();
  }

  categoryTargetConnected(element) {
    const option = this.selectTarget.querySelector('option')
    option.innerHTML = element.innerHTML
    element.remove();
  }
}
