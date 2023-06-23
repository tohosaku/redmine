/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="attachment"
export default class extends Controller {

  static targets = ['destroy', 'input', 'field', 'template']

  static values = { param: String, maxfilenumber: Number }

  connect() {
    this.element.attachment_controller = this;
  }

  add(e) {
    this.invoke(attachment => {
      try {
        attachment.addInputFiles(e.target);
      } catch(e) {
        this.alert(e);
      }
    })
  }

  uploadAndAttachFiles(files, inputEl) {
    this.invoke(attachment => {
      try {
        attachment.uploadAndAttachFiles(files, inputEl)
      } catch(e) {
        this.alert(e);
      }
    })
  }

  deleteFile(e) {
    if (e.target.matches('[data-delete-file=true]')) {
      this.inputTarget.style.display = '';
      e.currentTarget.remove();
    }
  }

  destroyTargetConnected(element) {
    this.inputTarget.style.display = '';
    element.remove()
  }

  invoke(fn) {
    import('attachment').then(mod => {
      const { default: Attachment } = mod;
      if (this.attachment === undefined) {
        this.attachment = new Attachment(this.fieldTarget,
                                         this.inputTarget,
                                         this.templateTarget.textContent,
                                         this.paramValue,
                                         this.maxfilenumberValue);
      }
      fn(this.attachment)
    })
  }

  alert(error) {
    window.alert(error.message);
  }
}
