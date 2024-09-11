import { Application } from "@hotwired/stimulus"
import ClasslistController from 'controllers/classlist_controller'
import { assert } from 'chai'

const html = '<div id="element" class="bar" data-controller="classlist"></div>'

suite('classlist controller', () => {

  let container;

  setup(async () => {
    container = document.getElementById('container')
    const app = Application.start(container);
    await app.register('classlist', ClasslistController);

    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  test('Add css class "foo"', async () => {
    const element = container.querySelector('#element');
    const target = '<template data-classlist-target="dummy" data-css="foo"></template>'
    await element.insertAdjacentHTML('beforeend', target);

    assert.isTrue(element.classList.contains("foo"));
  });
});

