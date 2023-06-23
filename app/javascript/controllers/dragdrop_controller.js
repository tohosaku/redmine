import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dragdrop"
export default class extends Controller {
  connect() {
    if (this.isSupportsDragAndDrop && !this.element.classList.contains('filedroplistner')) {
       this.element.classList.add('filedroplistner')
    }
  }

  get isSupportsDragAndDrop () {
    return !!(window.File && window.FileList && window.ProgressEvent && window.FormData)
  }

  onDragover(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.add('fileover')
    e.dataTransfer.dropEffect = 'copy';
  }

  onDragout(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.remove('fileover')
  }

  handleFile(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.remove('fileover')

    if (e.dataTransfer.types.includes('Files')) {
      const files = e.dataTransfer.files
      uploadAndAttachFiles(files, this.fileDrop);
    }
  }

  get isCustom() {
    return this.element.classList.contains('custom-field-filedroplistner')
  }

  get fileDrop() {
    if (this.isCustom) {
      return this.element.querySelector('input:file.custom-field-filedrop')
    } else {
      return this.element.querySelector('input:file.filedrop')
    }
  }

  copy(e) {
    copyImageFromClipboard(e)
  }
}
