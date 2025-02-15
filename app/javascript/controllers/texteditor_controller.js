import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'
import { jsonContent } from 'helper'

// Connects to data-controller="texteditor"
export default class extends Controller {

  static targets = ['editor', 'tabs', 'edittab', 'previewtab', 'elements', 'main', 'preview' ]
  static values  = { 'previewUrl': String }

  connect() {
    const lang = jsonContent('jstoolbar-locale')

    Promise.all([
      import('jstoolbar'),
      import(`jstoolbar/formatting/${this.element.dataset.formatting}`)
    ])
      .then(([mod, formatting]) => {
         const { default: jsToolBar } = mod;
         jsToolBar.strings = lang;
         this.toolbar = new jsToolBar(this, formatting.default)
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

  keyboardShortcuts(e) {
    this.toolbar.keyboardShortcuts.call(this.toolbar, e);
  }

  togglePreview(e) {
    this.toolbar.togglePreview(e);
  }

  execute(e) {
    this.toolbar.execute.call(this.toolbar, e);
  }
}
