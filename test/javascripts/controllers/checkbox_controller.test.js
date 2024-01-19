import { Application } from "@hotwired/stimulus"
import CheckboxController from 'controllers/checkbox_controller'
import { assert } from 'chai'

const html1 = `<div data-controller="checkbox">
      <a id="target" data-action="checkbox#toggle" data-checkbox-selector-param="input[type=checkbox]" href="#" title="Check all / Uncheck all"></a>Trackers
      <input type="checkbox" name="tracker_ids" value="1" checked="checked">
      <input type="checkbox" name="tracker_ids" value="2" checked="checked">
      <input type="checkbox" name="tracker_ids" value="3" checked="checked">
  </div>`

const html2 = `<div data-controller="checkbox">
      <a id="target" data-action="checkbox#toggle" data-checkbox-selector-param="input[type=checkbox]" href="#" title="Check all / Uncheck all"></a>Trackers
      <input type="checkbox" name="tracker_ids" value="1">
      <input type="checkbox" name="tracker_ids" value="2">
      <input type="checkbox" name="tracker_ids" value="3">
  </div>`

const html3 = `<div data-controller="checkbox">
      <a id="target" data-action="checkbox#toggle" data-checkbox-selector-param="input[type=checkbox]" href="#" title="Check all / Uncheck all"></a>Trackers
      <input type="checkbox" name="tracker_ids" value="1" checked="checked">
      <input type="checkbox" name="tracker_ids" value="2">
      <input type="checkbox" name="tracker_ids" value="3">
  </div>`

suite('checkbox controller', () => {

  suite('all checked', () => {
    let container;

    setup(async () => {
      container = document.getElementById('container')
      const app = Application.start(container);
      await app.register('checkbox', CheckboxController);

      container.insertAdjacentHTML('afterbegin', html1)
    });

    suite('click', () => {
      test('all checkboxes are cleared', async () => {
        const target = container.querySelector('#target');
        await target.click();
        const inputs = container.querySelectorAll('input[type=checkbox]')
        const allCleared = Array.from(inputs).every(e => e.checked == false)
        assert.isTrue(allCleared, 'All checkboxes are cleared');
      });
    });

    teardown(() => {
      const clone = container.cloneNode(false);
      container.parentNode.replaceChild(clone, container);
    });
  });

  suite('no checked', () => {
    let container;

    setup(async () => {
      container = document.getElementById('container')
      const app = Application.start(container);
      await app.register('checkbox', CheckboxController);

      container.insertAdjacentHTML('afterbegin', html2)
    });

    suite('click', () => {
      test('all checkboxes are checked', async () => {
        const target = container.querySelector('#target');
        await target.click();
        const inputs = container.querySelectorAll('input[type=checkbox]')
        const allCleared = Array.from(inputs).every(e => e.checked == true)
        assert.isTrue(allCleared, 'All checkboxes are checked');
      });
    });

    teardown(() => {
      const clone = container.cloneNode(false);
      container.parentNode.replaceChild(clone, container);
    });
  });

  suite('partial checked', () => {
    let container;

    setup(async () => {
      container = document.getElementById('container')
      const app = Application.start(container);
      await app.register('checkbox', CheckboxController);

      container.insertAdjacentHTML('afterbegin', html3)
    });

    suite('click', () => {
      test('all checkboxes are checked', async () => {
        const target = container.querySelector('#target');
        await target.click();
        const inputs = container.querySelectorAll('input[type=checkbox]')
        const allCleared = Array.from(inputs).every(e => e.checked == true)
        assert.isTrue(allCleared, 'All checkboxes are checked');
      });
    });

    teardown(() => {
      const clone = container.cloneNode(false);
      container.parentNode.replaceChild(clone, container);
    });
  });
});
