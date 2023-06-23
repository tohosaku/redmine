import { Controller } from "@hotwired/stimulus"

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

    const func = (file, result) => {
      if (file.type.indexOf("image") != -1) {
        result.push(new File([file], this.getFilename(new Date()), { type: file.type }));
      }
      return result
    }
    const files = clipboardData.files.reduce(func , [])

    if (files.length > 0) {
      this.target = e.target;
      this.upload(files);
    }
  }

  getFilename(date) {
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

    // insert uploaded image inline if dropped area is currently focused textarea
    const $textarea = $(this.target);
    if($textarea.hasClass('wiki-edit') && $.inArray(file.type, window.wikiImageMimeTypes) > -1) {
      var cursorPosition = $textarea.prop('selectionStart');
      var description = $textarea.val();
      var sanitizedFilename = file.name.replace(/[\/\?\%\*\:\|\"\'<>\n\r]+/, '_');
      var inlineFilename = encodeURIComponent(sanitizedFilename)
        .replace(/[!()]/g, function(match) { return "%" + match.charCodeAt(0).toString(16) });
      var newLineBefore = true;
      var newLineAfter = true;
      if(cursorPosition === 0 || description.substr(cursorPosition-1,1).match(/\r|\n/)) {
        newLineBefore = false;
      }
      if(description.substr(cursorPosition,1).match(/\r|\n/)) {
        newLineAfter = false;
      }

      $textarea.val(
        description.substring(0, cursorPosition)
        + (newLineBefore ? '\n' : '')
        + inlineFilename
        + (newLineAfter ? '\n' : '')
        + description.substring(cursorPosition, description.length)
      );

      $textarea.prop({
        'selectionStart': cursorPosition + newLineBefore,
        'selectionEnd': cursorPosition + inlineFilename.length + newLineBefore
      });
      $textarea.parents('.jstBlock')
               .find('.jstb_img').click();

      // move cursor into next line
      cursorPosition = $textarea.prop('selectionStart');
      $textarea.prop({
        'selectionStart': cursorPosition + 1,
        'selectionEnd': cursorPosition + 1
      });
    }
  }
}
