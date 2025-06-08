/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Application } from "@hotwired/stimulus"
import SortableController from 'controllers/sortable_controller'
import { assert } from 'chai'
import { createPointerEvent } from RAILS_ASSET_URL('/test_utils.js')

const html = `
<div id="sortable" data-controller="sortable" data-action="pointerdown->sortable#start
                                                           pointermove->sortable#move
                                                           pointerup->sortable#end
                                                           pointercancel->sortable#end
                                                           touchstart->sortable#noop
                                                           dragstart->sortable#noop">
  <div class="sort-handle" data-sortable-target="item" data-sorted-index="0" style="width: 100px; height: 20px">Item 1</div>
  <div class="sort-handle" data-sortable-target="item" data-sorted-index="1" style="width: 100px; height: 20px">Item 2</div>
  <div class="sort-handle" data-sortable-target="item" data-sorted-index="2" style="width: 100px; height: 20px">Item 3</div>
</div>`
suite('sortable controller', () => {
  let container, app, element;

  setup(async () => {
    container = document.getElementById('container')
    app = Application.start(container);
    await app.register('sortable', class extends SortableController{
      connect(){ super.connect(); this.element.controller = this }
    });

    container.insertAdjacentHTML('afterbegin', html)
    element = document.getElementById('sortable');
  });

  teardown(() => {
    app.stop();
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  test('initialize correctly with default state', () => {
    const controller = element.controller;
    assert.exists(controller);
    assert.instanceOf(controller.state, controller.releasing.constructor);
  });

  test('transition to DraggingInside state on mouse drag', async () => {
    const controller = element.controller;
    const item = element.querySelector('[data-sorted-index="1"]');
    const event = createPointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
      button: 0,
    });
    await item.dispatchEvent(event);

    assert.instanceOf(controller.state, controller.dragging.constructor);
    assert.exists(controller.dragElement);
  });

  test('update item positions on drag', async () => {
    const controller = element.controller;
    const item = element.querySelector('[data-sorted-index="1"]');
    const eventStart = createPointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
      button: 0,
    });
    await item.dispatchEvent(eventStart);

    const eventMove = createPointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 30,
    });
    await item.dispatchEvent(eventMove);

    assert.equal(controller.dragElement.style.transform, 'translate(0px, 20px)');
  });

  test('trigger a sorted event on drag end', async () => {
    const controller = element.controller;
    const item = element.querySelector('[data-sorted-index="1"]');
    const eventStart = createPointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
      button: 0,
    });
    await item.dispatchEvent(eventStart);

    let sortedEventTriggered = false;
    element.addEventListener('sortable:sorted', () => {
      sortedEventTriggered = true;
    });

    const eventEnd = createPointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
    });
    await item.dispatchEvent(eventEnd);

    assert.isTrue(sortedEventTriggered);
    assert.instanceOf(controller.state, controller.releasing.constructor);
  });

  test('handle moving out of an area', async () => {
    const controller = element.controller;
    const item = element.querySelector('[data-sorted-index="1"]');
    const eventStart = createPointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
      button: 0,
    });
    await item.dispatchEvent(eventStart);

    const eventMoveOutside = createPointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: 1000, // Simulating moving out of bounds
      clientY: 1000,
    });
    item.dispatchEvent(eventMoveOutside);

    assert.instanceOf(controller.state, controller.dragging.constructor);
  });
});
