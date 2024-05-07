import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'
import jsToolBar from 'jstoolbar'

// Connects to data-controller="texteditor"
export default class extends Controller {

  static targets = ['editor', 'tabs', 'edittab', 'previewtab', 'elements', 'main', 'preview' ]
  static values  = { 'previewUrl': String }

  connect() {
    Promise.all([
      import(`jstoolbar/lang/${this.language}`),
      import(`jstoolbar/${this.element.dataset.formatting}`)
    ])
      .then(mods => {
         jsToolBar.strings = mods[0].default
         this.toolbar = new jsToolBar(this, mods[1].default)
         this.toolbar.setHelpLink(this.element.dataset.help)
         this.toolbar.draw()
     })
  }

  preview(e) {
    const data = { text: this.editorTarget.value }; 

    const form = e.target.closest('form');
    form.querySelectorAll('.attachments_fields input').forEach(el => (data[el.name] = el.value))

    post(this.previewUrlValue, {
      body: data
    }).then(res => {
      if (res.ok) {
        return res.html
      }
    }).then(html => {
      this.previewTarget.innerHTML = html;
      setupWikiTableSortableHeader();
    });
  }

  shortcut(e) {
    e.preventDefault()
    this.toolbar.keyboardShortcuts.call(this.toolbar, e);
  }

  hidePreview(e) {
    e.preventDefault()
    this.toolbar.hidePreview.call(this.toolbar, e);
  }

  showPreview(e) {
    e.preventDefault()
    this.toolbar.showPreview.call(this.toolbar, e);
  }

  get language() {
    return document.head.querySelector("meta[name=language]").content
  }
}
