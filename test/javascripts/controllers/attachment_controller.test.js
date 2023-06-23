import { Application } from "@hotwired/stimulus"
import AttachmentController from 'controllers/attachment_controller'
import { BatchInterceptor } from '@mswjs/interceptors'
import browserInterceptors from '@mswjs/interceptors/presets/browser'
import { assert } from 'chai';
import { Turbo } from "@hotwired/turbo-rails";

const html = `<form><span class="attachments_form" data-controller="attachment" data-attachment-maxfilenumber-value="2">
  <span id="attachments_upload" class="attachments_fields" data-attachment-target="field">
  </span>
  <span class="add_attachment" data-attachment-target="input">
  <input id="inputFile" type="file" data-upload-path="/uploads.turbo_stream" data-action="change->attachment#add" data-max-file-size-message="error attachment too big" data-max-number-of-files-message="error attachments too many">
  </span>
  <script type="text/plain" data-attachment-target="template">
    <span id="attachments_\${attachmentId}">
      <input type="text" name="attachments[\${attachmentId}][filename]" value="\${filename}" class="icon icon-attachment filename readonly" readonly="readonly" />
      <input type="text" name="attachments[\${attachmentId}][description]" class="description" maxlength="255" placeholder="Optional description" style="\${showdescription}" />
      <input type="hidden" name="attachments[\${attachmentId}][token]" class="token" autocomplete="off" />
      <a class="icon-only icon-del remove-upload" style="\${showlink}" data-action="attachments#removeFile" href="#">&nbsp;</a>
    </span>
  </script>
  </span>
  </form>`

suite('attachment controller', () => {

  let container;
  let app;
  let interceptor;

  setup(async () => {
    container = document.getElementById('container')
    app = Application.start(container);
    interceptor = new BatchInterceptor({
      name: 'my-interceptor',
      interceptors: browserInterceptors,
    });
    window.Turbo = Turbo;
    await interceptor.apply()
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
    window.Turbo = undefined;
    interceptor.dispose();
  });

  suite('File uploaded with AJAX', () => {

    let _alert;
    let fakeAlert;
    let file;
    let dt

    setup(async () => {
      app.register('attachment', AttachmentController);
      _alert = window.alert;
      fakeAlert = []
      window.alert = (message) => { fakeAlert.push(message); }

      const fileString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
      const blob = await fetch(fileString).then(res => res.blob());
      file = new File([blob], "sample.png", { type: 'image/png'});
      dt = new DataTransfer();

      await container.insertAdjacentHTML('afterbegin', html)
    });

    teardown(() => {
      window.alert = _alert;
    });

    test('Post does not occur because no file is attached', async () => {
      let requestOccured = false;
      interceptor.on('request', ({ request, controller }) => {
        requestOccured = true;
        controller.respondWith(new Response(null, { status: 500 }))
      })

      await inputFile.dispatchEvent(new Event('change'));
      assert.isNotTrue(requestOccured);
    });

    test('Post request occurs on change event', async () => {
      dt.items.add(file);
      inputFile.files = dt.files;

      interceptor.on('request', ({ request, controller }) => {
        assert.equal(request.method, 'POST');
        controller.respondWith(new Response(null, { status: 200 }))
      })

      await inputFile.dispatchEvent(new Event('change'));
    });

    test('Post request occurs on change event and get server error', async () => {
      dt.items.add(file);
      inputFile.files = dt.files;

      interceptor.on('request', ({ request, controller }) => {
        assert.equal(request.method, 'POST');
        controller.respondWith(new Response(null, { status: 500, statusText: 'Server Error' }))
      })

      await inputFile.dispatchEvent(new Event('change'));
      // check result in next tick
      setTimeout(() => {
        const error = document.querySelector('div[class=uploaderror]');
        assert.equal(error.textContent, 'Server Error');
      }, 0);
    });

    test('Alert when attachment too big', async () => {
      inputFile.dataset.maxFileSize = '1';

      dt.items.add(file);
      inputFile.files = dt.files;

      interceptor.on('request', ({ request, controller }) => {
        controller.respondWith(new Response(null, { status: 500 }))
      })

      await inputFile.dispatchEvent(new Event('change'));
      assert.equal(fakeAlert.length, 1);
      assert.equal(fakeAlert[0], "error attachment too big");
    });

    test('Alert when too many files are attached', async () => {
      dt.items.add(file);
      dt.items.add(file);
      dt.items.add(file);
      inputFile.files = dt.files;

      interceptor.on('request', ({ request, controller }) => {
        controller.respondWith(new Response(null, { status: 500 }))
      })

      await inputFile.dispatchEvent(new Event('change'));
      assert.equal(fakeAlert.length, 1);
      assert.equal(fakeAlert[0], "error attachments too many");
    });
  });

  suite('File uploaded without AJAX', () => {
    setup(async () => {
      app.register('attachment', class extends AttachmentController {
        get attachment() {
          const attachment = super.attachment
          attachment.isAjaxSupported = (element) => false
          return attachment
        }
      });
      await container.insertAdjacentHTML('afterbegin', html)
    });

    test('element #attachments_1 exists', async () => {
      await inputFile.dispatchEvent(new Event('change'));
      const element = document.getElementById('attachments_1');
      assert.isNotNull(element);
    });
  });
});
