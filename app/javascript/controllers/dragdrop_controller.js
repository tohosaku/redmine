import { Controller } from "@hotwired/stimulus"
import { randomKey } from "helper"

// Connects to data-controller="dragdrop"
export default class extends Controller {
  static targets = ['filedrop', 'attachment']

  connect() {
    this.target = '';

    if (this.isSupportsDragAndDrop && !this.element.classList.contains('filedroplistner')) {
       this.element.classList.add('filedroplistner')
    }
  }

  get isSupportsDragAndDrop () {
    return !!(window.File && window.FileList && window.ProgressEvent && window.FormData)
  }

  start(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.add('fileover')
    e.dataTransfer.dropEffect = 'copy';
  }

  end(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.remove('fileover')
  }

  handleFile(e) {
    if (!this.isSupportsDragAndDrop) return;

    this.element.classList.remove('fileover')

    if (e.dataTransfer.types.includes('Files')) {
      this.target = e.target
      const files = e.dataTransfer.files
      // use attachment target controller
      this.upload(files);
    }
  }

  copyImageFromClipBoard(e) {
    if (!e.target.classList.contains('wiki-edit')) return;

    const clipboardData = e.clipboardData || e.originalEvent.clipboardData
    if (!clipboardData) return;
    if (clipboardData.types.some((t) => /^text\/plain$/.test(t))) return;

    const func = (result, file) => {
      if (file.type.indexOf("image") != -1) {
        result.push(new File([file], this.getFilename(new Date(), file), { type: file.type }));
      }
      return result
    }
    const files = Array.from(clipboardData.files).reduce(func , [])

    if (files.length > 0) {
      this.target = e.target;
      this.upload(files);
    }
  }

  getFilename(date, file) {
    return 'clipboard-'
      + date.getFullYear()
      + ('0'+(date.getMonth()+1)).slice(-2)
      + ('0'+date.getDate()).slice(-2)
      + ('0'+date.getHours()).slice(-2)
      + ('0'+date.getMinutes()).slice(-2)
      + '-' + randomKey(5).toLocaleLowerCase()
      + '.' + file.name.split('.').pop();
  }

  upload(files) {
    this.attachmentTarget.attachment_controller.uploadAndAttachFiles(files, this.filedropTarget);
  }

  addInlineAttachmentMarkup(e) {
    if (typeof e.detail === 'undefined') return;

    const file = e.detail.file
    if (typeof file === 'undefined') return;

    const textarea = this.target;
    // insert uploaded image inline if dropped area is currently focused textarea
    if (!textarea.classList.contains('wiki-edit') || !window.wikiImageMimeTypes.includes(file.type)) return;

    const cursorPosition = textarea.selectionStart;
    const description = textarea.value;

    const inlineFilename = this.crateFilename(file);
    const newLineBefore  = !(cursorPosition === 0 || description.substr(cursorPosition-1,1).match(/\r|\n/));
    const newLineAfter   = !description.substr(cursorPosition,1).match(/\r|\n/);

    textarea.value = description.substring(0, cursorPosition) +
      (newLineBefore ? '\n' : '') +
      inlineFilename +
      (newLineAfter ? '\n' : '') +
      description.substring(cursorPosition, description.length);

    textarea.selectionStart = cursorPosition + newLineBefore;
    textarea.selectionEnd = cursorPosition + inlineFilename.length + newLineBefore;
    const img = textarea.closest('.jstBlock').querySelector('.jstb_img')
    img.click();

    // move cursor into next line
    const newPosition = textarea.selectionStart;
    textarea.selectionStart = newPosition + 1;
    textarea.selectionEnd = newPosition + 1;
  }

  createFilename(file) {
    const sanitizedFilename = file.name.replace(/[\/\?\%\*\:\|\"\'<>\n\r]+/, '_');
    return encodeURIComponent(sanitizedFilename).replace(/[!()]/g, function(match) { return "%" + match.charCodeAt(0).toString(16) });
  }
}
