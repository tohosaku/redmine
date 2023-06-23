import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"

// Connects to data-controller="attachment"
export default class extends Controller {

  static targets = ['destroy', 'input', 'field', 'template']

  static values = { param: String, maxfilenumber: Number }

  connect() {
    this.element.attachment_controller = this;
  }

  get attachment() {
    if (this._attachment === undefined) {
      this._attachment = new Attachment(this.fieldTarget,
                                        this.inputTarget,
                                        this.templateTarget.textContent,
                                        this.paramValue,
                                        this.maxfilenumberValue);
    }
    return this._attachment
  }

  add(e) {
    this.attachment.addInputFiles(e.currentTarget);
  }

  uploadAndAttachFiles(files, inputEl) {
    this.attachment.uploadAndAttachFiles(files, inputEl)
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
}

export function format(template, args) {

  if (typeof args !== 'object' || args == null) return template;

  return Object.entries(args).reduce(
    (result, [arg, val]) => result.replaceAll(`$\{${arg}}`, val),
    template
  )
}

function createFileSpan(template, params) {
  const content = format(template, params);
  const fragment = document.createElement("template");
  fragment.innerHTML = content;
  return fragment.content.cloneNode(true).firstElementChild;
}

export function makeActionQueue() {
  let funcs = undefined;

  return {
    enqueue: (value) => {
      if (typeof value !== 'function') throw new Error ('Argument must be a function')

      if (typeof funcs === 'undefined') {
        const root = { value };
        funcs = { head: root, tail: root };
      } else {
        funcs.tail.next = { value };
        funcs.tail = funcs.tail.next;
      }
    },

    dequeue: () => {
      if (typeof funcs === 'undefined') return undefined;
      const value = funcs.head.value;

      if (typeof funcs.head.next == 'undefined') {
        funcs = undefined;
      } else {
        funcs.head = funcs.head.next;
      }

      return value();
    },

    get isEmpty() {
      return typeof funcs === 'undefined'
    }
  }
}

class Attachment {

  constructor(field, input, template, param, maxfilenumber) {
    this.field = field;
    this.input = input;
    this.template = template;
    this.param = param;
    this.maxfilenumber = maxfilenumber;
    this.uploading = 0;
    this.nextAttachmentId = 1;
  }

  addInputFiles(inputEl) {
    const clearedFileInput = inputEl.cloneNode(true)
    clearedFileInput.value = '';

    if (this.isAjaxSupported(inputEl)) {
      // upload files using ajax
      this.uploadAndAttachFiles(inputEl.files, inputEl);
      inputEl.remove();
    } else {
      // browser not supporting the file API, upload on form submission
      const aFilename = inputEl.value.split(/\/|\\/);
      const { fileSpan } = this.addFile(inputEl, { name: aFilename[ aFilename.length - 1 ] }, false);
      if (fileSpan) {
        inputEl.setAttribute('name',  `${this.param}[${fileSpan.id}][file]`);
        inputEl.setAttribute('style', 'display:none;');
        fileSpan.append(inputEl);
      }
    }
    this.input.prepend(clearedFileInput);
  }

  isAjaxSupported(element) {
    const xhr = new XMLHttpRequest();
    return xhr.upload && element.files;
  }

  uploadAndAttachFiles(files, inputEl) {
    const filesArray   = Array.from(files)
    const maxFileSize  = parseInt(inputEl.dataset.maxFileSize);

    const filesLength  = this.field.children.length + filesArray.length
    const sizeExceeded = filesArray.some((file) => file.size && !Number.isNaN(maxFileSize) && file.size > maxFileSize);

    if (sizeExceeded) {
      window.alert(inputEl.dataset.maxFileSizeMessage);
    } else {
      filesArray.forEach((file) => {
        const { attachmentId, fileSpan } = this.addFile(inputEl, file, true);
        this.ajaxUpload(file, attachmentId, fileSpan, inputEl);
      });
    }

    if (filesLength > this.maxfilenumber) {
      window.alert(inputEl.dataset.maxNumberOfFilesMessage);
    }

    return sizeExceeded;
  }

  addFile(inputEl, file, eagerUpload) {
    if (this.isFileNumExceeded()) return null;

    const attachmentId = this.nextAttachmentId++;
    const fileSpan = createFileSpan(this.template,
      {
        attachmentId: attachmentId,
        filename: file.name,
        showdescription: !eagerUpload ? '' : 'display:none',
        showlink: eagerUpload ? '' : 'display:none'
      });

    this.field.appendChild(fileSpan);
    this.input.style.display = this.isFileNumExceeded() ? 'none' : '';

    return { fileSpan: fileSpan, attachmentId: attachmentId }
  }

  isFileNumExceeded() {
    this.field.children.length >= this.maxfilenumber
  }

  ajaxUpload(file, attachmentId, fileSpan, inputEl) {

    const form = inputEl.form;
    const buttons = document.querySelectorAll('input[type=submit]')
    const progress = document.createElement('progress')

    function onLoadstart(e) {
      fileSpan.classList.remove('ajax-waiting');
      fileSpan.classList.add('ajax-loading');

      buttons.forEach(b => { b.disabled = true })
      form.disabled = true
    }

    function onProgress(e) {
      if(e.lengthComputable) {
        progress.setAttribute( 'value', e.loaded * 100 / e.total );
      }
    }

    if (typeof form.uploadQueue == 'undefined') {
      form.uploadQueue = makeActionQueue()
    }

    const actualUpload = (file, attachmentId, fileSpan) => {

      this.uploading++;

      this.uploadBlob(file, inputEl.dataset.uploadPath, attachmentId, {
        loadstartEventHandler: onLoadstart.bind(progress),
        progressEventHandler: onProgress.bind(progress)
      }).then((html) => {
        Turbo.renderStreamMessage(html);

        const event = new CustomEvent('attachment:fileAdded', { detail: { file: file }})
        fileSpan.dispatchEvent(event);

        progress.setAttribute('value', '100');
        progress.remove();
        fileSpan.querySelector('input.description, a').style.display = 'inline-block';
      })
        .catch((text) => {
         const error = document.createElement('div')
         error.classList.add('uploaderror')
         error.textContent = text;
         progress.after(error);
         progress.remove();
        })
        .finally(() => {
          this.uploading--;
          fileSpan.classList.remove('ajax-loading');
          if (form.uploadQueue.isEmpty && this.uploading == 0) {
            buttons.forEach(b => { b.disabled = false })
            form.disabled = false
          }
          form.uploadQueue.dequeue();
        });
    }

    progress.setAttribute('max', '100');
    fileSpan.querySelector('input.filename').after(progress);
    fileSpan.classList.add('ajax-waiting');

    const maxSyncUpload = inputEl.dataset['max-concurrent-uploads'];

    if(maxSyncUpload == null || maxSyncUpload <= 0 || this.uploading < maxSyncUpload) {
      actualUpload(file, attachmentId, fileSpan);
    } else {
      form.uploadQueue.enqueue(actualUpload.bind(this, file, attachmentId, fileSpan));
    }
  }

  get token() {
    const element = document.querySelector('meta[name=csrf-token]')
    if (element !== null) {
      return element.getAttribute('content');
    }
  }

  uploadBlob(blob, uploadUrl, attachmentId, options) {

    const actualOptions = {
      loadstartEventHandler: null,
      progressEventHandler: null,
      ...options};

    const params = new URLSearchParams({
      'attachment_id': attachmentId
    })

    if (blob instanceof window.Blob) {
      params.set('filename', blob.name)
      params.set('content_type', blob.type)
    }
    const url = `${uploadUrl}?${params.toString()}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', url, true);

      // Set rails csrf token
      xhr.setRequestHeader('X-CSRF-Token', this.token);

      // Use turbo stream
      xhr.setRequestHeader('Accept', 'text/vnd.turbo-stream.html');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      // cache: false
      // https://stackoverflow.com/questions/22356025/force-cache-control-no-cache-in-chrome-via-xmlhttprequest-on-f5-reload
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.upload.onloadstart = actualOptions.loadstartEventHandler;
      xhr.upload.onprogress = actualOptions.progressEventHandler;
      xhr.onerror = () => {
        reject(xhr.statusText);
      };
      xhr.send(blob);
    });
  }
}
