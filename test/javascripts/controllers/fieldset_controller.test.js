import { assert } from 'chai'

const html = `<div data-controller="fieldset">
  </div>`

suite('fieldset controller', () => {

  let container;

  setup(async () => {
    container = document.getElementById('container')
    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  suite('click', () => {
  });
});
