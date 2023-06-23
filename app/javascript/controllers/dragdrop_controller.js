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

    const newLineBefore  = !(cursorPosition === 0 || description.substr(cursorPosition-1,1).match(/\r|\n/));
    const newLineAfter   = !description.substr(cursorPosition,1).match(/\r|\n/);

    getInlineAttachmentMarkup(file)
      .then(imageMarkup => {
        textarea.value = description.substring(0, cursorPosition) +
          (newLineBefore ? '\n' : '') +
          imageMarkup +
          (newLineAfter ? '\n' : '') +
          description.substring(cursorPosition, description.length);

        // Move cursor after the inserted markup
        const newCursorPosition = cursorPosition + (newLineBefore ? 1 : 0) + imageMarkup.length;
        textarea.selectionStart = newCursorPosition + 1;
        textarea.selectionEnd = newCursorPosition + 1;
      });
  }
}

function getImageWidth(file) {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          resolve(img.width);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve(0);
    }
  });
}

async function getInlineAttachmentMarkup(file) {
  const sanitizedFilename = file.name.replace(/[\/\?\%\*\:\|\"\'<>\n\r]+/g, '_');
  const inlineFilename = encodeURIComponent(sanitizedFilename)
    .replace(/[!()]/g, function(match) { return "%" + match.charCodeAt(0).toString(16) });

  const isFromClipboard = /^clipboard-\d{12}-[a-z0-9]{5}\.\w+$/.test(file.name);
  let imageDisplayWidth;
  if (isFromClipboard) {
    const imageWidth = await getImageWidth(file).catch(() => 0);
    imageDisplayWidth = Math.round(imageWidth / window.devicePixelRatio);
  }
  const hasValidWidth = isFromClipboard && imageDisplayWidth > 0;

  switch (document.body.getAttribute('data-text-formatting')) {
    case 'textile':
      return hasValidWidth
        ? `!{width: ${imageDisplayWidth}px}.${inlineFilename}!`
        : `!${inlineFilename}!`;
    case 'common_mark':
      return hasValidWidth
        ? `<img style="width: ${imageDisplayWidth}px;" src="${inlineFilename}"><br>`
        : `![](${inlineFilename})`;
    default:
      // Text formatting is "none" or unknown
      return '';
  }
}
