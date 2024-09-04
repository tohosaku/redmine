import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="queries--columns"
export default class extends Controller {
  moveOptions(e) {
    const from_id = e.params.from;
    const to_id   = e.params.to;
    $(this.element.form[from_id]).find('option:selected').detach().prop("selected", false).appendTo($(this.element.form[to_id]));
  }

  moveOptionTop(e) {
    const theSel = this.element.form[e.params.id];
    $(theSel).find('option:selected').detach().prependTo($(theSel));
  }

  moveOptionUp(e) {
    const theSel = this.element.form[e.params.id];
    $(theSel).find('option:selected').each(function(){
      $(this).prev(':not(:selected)').detach().insertAfter($(this));
    });
  }

  moveOptionDown(e) {
    const theSel = this.element.form[e.params.id];
    $($(theSel).find('option:selected').get().reverse()).each(function(){
      $(this).next(':not(:selected)').detach().insertBefore($(this));
    });
  }

  moveOptionBottom(e) {
    const theSel = this.element.form[e.params.id];
    $(theSel).find('option:selected').detach().appendTo($(theSel));
  }
}
