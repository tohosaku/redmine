import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"

// Connects to data-controller="attachment"
export default class extends Controller {

  static targets = ['destroy', 'input']

  connect() {
    window.FetchRequest = FetchRequest;
  }

  add(e) {
    this.addInputFiles(e.currentTarget);
  }

  destroyTargetConnected(element) {
    this.inputTarget.show();
    element.remove()
  }

  addInputFiles(inputEl) {
    var attachmentsFields = $(inputEl).closest('.attachments_form').find('.attachments_fields');
    var addAttachment = $(inputEl).closest('.attachments_form').find('.add_attachment');
    var clearedFileInput = $(inputEl).clone().val('');
    var sizeExceeded = false;
    var param = $(inputEl).data('param');
    if (!param) {param = 'attachments'};

    if ($.ajaxSettings.xhr().upload && inputEl.files) {
      // upload files using ajax
      sizeExceeded = uploadAndAttachFiles(inputEl.files, inputEl);
      $(inputEl).remove();
    } else {
      // browser not supporting the file API, upload on form submission
      var attachmentId;
      var aFilename = inputEl.value.split(/\/|\\/);
      attachmentId = addFile(inputEl, { name: aFilename[ aFilename.length - 1 ] }, false);
      if (attachmentId) {
        $(inputEl).attr({ name: param + '[' + attachmentId + '][file]', style: 'display:none;' }).appendTo('#attachments_' + attachmentId);
      }
    }
    clearedFileInput.prependTo(addAttachment);
  }
}
