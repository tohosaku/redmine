import { Controller } from "@hotwired/stimulus"
import { observeAutocomplete } from 'redmine'

// Connects to data-controller="users--form"
export default class extends Controller {
  static values = { path:String }
  static targets = ['generate']

  connect() {
    if (this.pathValue !== '') {
      observeAutocomplete(this.element, this.pathValue, {
        select: function(event, ui) {
          $('input#user_firstname').val(ui.item.firstname);
          $('input#user_lastname').val(ui.item.lastname);
          $('input#user_mail').val(ui.item.mail);
          $('select#user_auth_source_id option').each(function(){
            if ($(this).attr('value') == ui.item.auth_source_id) {
              $(this).prop('selected', true);
              $('select#user_auth_source_id').trigger('change');
            }
          });
        }
      });
    }
    this.setPasswordField(this.generateTarget)
  }

  initGeneration(e) {
    this.setPasswordField(e.currentTarget)
  }

  setPasswordField(element) {
    const passwd = $('#user_password, #user_password_confirmation');
    if (element.checked){
      passwd.val('').attr('disabled', true);
    }else{
      passwd.removeAttr('disabled');
    }
  }
}
