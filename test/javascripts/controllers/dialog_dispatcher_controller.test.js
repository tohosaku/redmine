/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Application } from "@hotwired/stimulus"
import DialogDispatcherController from 'controllers/dialog_dispatcher_controller'
import DialogController from 'controllers/dialog_controller'
import { assert } from 'chai'

const html = `<div id="dialog" data-controller="dialog" style="display:none">
                <button data-action="dialog#hide">close</button>
              </div>
              <div id="dispatcher" data-controller="dialog-dispatcher" data-dialog-dispatcher-dialog-outlet="#dialog">
                <button id="button" data-action="dialog-dispatcher#show" data-dialog-dispatcher-width-param="500px">Show Dialog</button>
              </div>
              <div id="wrapper"></div>
              <div id="modal-backdrop"></div>`;

suite('DialogDispatcherController', () => {

  let container;

  setup(async () => {
    container = document.getElementById('container')
    const app = Application.start(container);
    await app.register('dialog-dispatcher', DialogDispatcherController);
    await app.register('dialog', DialogController);

    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  test('show the dialog with the specified width', () => {
    const button = document.getElementById('button')
    button.click();

    const dialog = document.getElementById('dialog')
    assert.equal(dialog.style.width, '500px');
    assert.equal(dialog.style.display, '');
  });

  test('show the dialog when show target is connected', async () => {
    const html = `<div id="remote-dialog" data-controller="dialog" data-dialog-dispatcher-target="show" style="display:none" data-width="300px">
                <button data-action="dialog#hide">close</button>
              </div>`

    const dispatcher = document.getElementById('dispatcher')
    dispatcher.insertAdjacentHTML('afterbegin', html)

    const remotedialog = await document.getElementById('remote-dialog')
    assert.equal(remotedialog.style.width, '300px');
    assert.equal(remotedialog.style.display, '');
  });

  test('hide the dialog when hide target is Connected', async () => {
    const button = document.getElementById('button')
    button.click();

    const dialog = document.getElementById('dialog')
    const dispatcher = document.getElementById('dispatcher')
    await dispatcher.insertAdjacentHTML('afterbegin', '<template data-dialog-dispatcher-target="hide"></template>')
    assert.equal(dialog.style.display, 'none');

    const target = document.querySelector('[data-dialog-dispatcher-target=hide]')
    assert.isNull(target)
  });
});
