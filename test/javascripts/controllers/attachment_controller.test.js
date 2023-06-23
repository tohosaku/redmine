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
  <input class="inputFile" type="file" data-upload-path="/uploads.turbo_stream" data-action="change->attachment#add" data-max-file-size-message="error attachment too big" data-max-number-of-files-message="error attachments too many">
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
  let inputFile;

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
    delete window.Turbo
    interceptor.dispose();
  });

  suite('File uploaded with AJAX', () => {

    let file;
    let dt
    let observer;

    setup(async () => {
      app.register('attachment', class extends AttachmentController {
        initialize() {
          this.fakeAlert = [];
        }
      });

      const fileString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
      const blob = await fetch(fileString).then(res => res.blob());
      file = new File([blob], "sample.png", { type: 'image/png'});
      dt = new DataTransfer();

      await container.insertAdjacentHTML('afterbegin', html)
      inputFile = container.querySelector('.inputFile');
    });

    teardown(() => {
      if (typeof observer !== 'undefined') {
        observer.disconnect();
      }
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

        const fileSpan = container.querySelector('#attachments_1')
        observer.observe(fileSpan, { childList: true })
      })

      const callback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            assert.equal(mutation.addedNodes[0].textContent, 'Server Error');
          }
        }
      };
      observer = new MutationObserver(callback);

      await inputFile.dispatchEvent(new Event('change'));
    });

    test('Alert when attachment too big', function(done) {
      inputFile.dataset.maxFileSize = '1';

      dt.items.add(file);
      inputFile.files = dt.files;

      const element = container.querySelector('[data-controller=attachment]')
      const controller = element.attachment_controller;

      interceptor.on('request', ({ request, controller }) => {
        controller.respondWith(new Response(null, { status: 200 }))
      })

      const alert = function(error) {
        this.fakeAlert.push(error.message)
        assert.equal(this.fakeAlert.length, 1);
        assert.equal(this.fakeAlert[0], "error attachment too big");
        done();
      }
      controller.alert = alert.bind(controller);
      inputFile.dispatchEvent(new Event('change'));
    });

    test('Alert when too many files are attached', function(done) {
      dt.items.add(file);
      dt.items.add(file);
      dt.items.add(file);
      inputFile.files = dt.files;

      const element = container.querySelector('[data-controller=attachment]')
      const controller = element.attachment_controller;

      interceptor.on('request', ({ request, controller }) => {
        controller.respondWith(new Response(null, { status: 200 }))
      })

      const alert = function(error) {
        this.fakeAlert.push(error.message)
        assert.equal(this.fakeAlert.length, 1);
        assert.equal(this.fakeAlert[0], "error attachments too many");
        done();
      }
      controller.alert = alert.bind(controller);
      inputFile.dispatchEvent(new Event('change'));
    });
  });

  suite('File uploaded without AJAX', () => {
    let controller
    setup(async () => {
      app.register('attachment', class extends AttachmentController {
        connect() {
          super.invoke(attachment => {
            attachment.isAjaxSupported = (element) => false
          })
        }
      });
      await container.insertAdjacentHTML('afterbegin', html)
      inputFile = container.querySelector('.inputFile');
    });

    test('element #attachments_1 exists', (done) => {
      setTimeout(() => {
        let attach1 = document.getElementById('attachments_1');
        // attach1 = container.querySelector('#attachments_1');
        assert.isNotNull(attach1);
        done();
      })
      inputFile.dispatchEvent(new Event('change'));
    });
  });
});
