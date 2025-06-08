/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Application } from "@hotwired/stimulus"
import DialogController from 'controllers/dialog_controller'
import { assert } from 'chai'
import { createPointerEvent } from RAILS_ASSET_URL('/test_utils.js')

const html = `
  <div data-controller="dialog" id="dialog">
    <div data-action="pointerdown->dialog#start pointerup->dialog#end pointercancel->dialog#end  pointermove->dialog#move touchstart->dialog#noop dragstart->dialog#noop" data-dialog-target="handler" id="handler">Drag Here</div>
    <div id="hide" data-dialog-target="cancel">Close</div>
  </div>
  <div id="wrapper"></div>
  <div id="modal-backdrop"></div>`

suite('dialog controller', () => {

  let container;
  let controller;

  setup(async () => {
    container = document.getElementById('container')
    const app = Application.start(container);
    await app.register('dialog', DialogController);

    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  test('connect lifecycle method', () => {
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;
    assert.isNotNull(controller);
    assert.isNull(controller.dragging);
    assert.isNull(controller.backdrop);
  });

  test('start dragging', async () => {
    const handler = document.getElementById('handler');
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;

    const event = createPointerEvent('pointerdown', { button: 0, clientX: 100, clientY: 100 });
    await handler.dispatchEvent(event);

    assert.isNotNull(controller.dragging);
    assert.isDefined(controller.dragging.dx);
    assert.isDefined(controller.dragging.dy);
    assert.isTrue(handler.classList.contains("dragging"));
  })

  test('move dialog', async () => {
    const handler = document.getElementById('handler');
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;

    let event = createPointerEvent('pointerdown', { button: 0, clientX: 100, clientY: 100 });
    await handler.dispatchEvent(event);

    event = createPointerEvent("pointermove", { clientX: 150, clientY: 150 });
    await handler.dispatchEvent(event);

    const pos = controller.pos;
    assert.isDefined(pos.x);
    assert.isDefined(pos.y);
    assert.notEqual(pos.x, 0);
    assert.notEqual(pos.y, 0);
  })

  test('end dragging', async () => {
    const handler = document.getElementById('handler');
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;

    let event = createPointerEvent('pointerdown', { button: 0, clientX: 100, clientY: 100 });
    await handler.dispatchEvent(event);

    event = createPointerEvent("pointerup");
    await handler.dispatchEvent(event);

    assert.isNull(controller.dragging);
    assert.isFalse(handler.classList.contains("dragging"));
  });

  test('show dialog', async () => {
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;
    controller.show({ width: "500px", backdrop: "modal-backdrop" });
    const backdrop = document.getElementById("modal-backdrop");

    assert.equal(dialog.style.display, "");
    assert.equal(dialog.style.width, "500px");
    assert.isTrue(backdrop.classList.contains("modal-backdrop-open"));
  })

  test('hide dialog', () => {
    const dialog = document.getElementById('dialog');
    controller = dialog.dialog_controller;
    controller.show({ backdrop: "modal-backdrop" });
    controller.hide();
    const backdrop = document.getElementById("modal-backdrop");

    assert.equal(dialog.style.display, 'none');
    assert.isFalse(backdrop.classList.contains('modal-backdrop-open'));
  })
})
