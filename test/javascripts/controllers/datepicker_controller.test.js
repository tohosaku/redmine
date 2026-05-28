/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Application } from "@hotwired/stimulus"
import DatepickerController from 'controllers/datepicker_controller'
import { assert } from 'chai'
import { isVisible } from 'helper'

const html = `<template id="datepicker-template">
                <wc-datepicker data-datepicker-target="picker" data-action="click@window->datepicker#close scroll@document->datepicker#close selectDate->datepicker#select" locale="ja" show-month-stepper="true" show-clear-button="true" show-today-button="true"></wc-datepicker>
              </template>
              <script type="application/json" id="datepicker-labels">{"labels":{"clearButton":"Clear","todayButton":"today"},"first-days-of-week":0}</script>
              <div id="outsideOfPicker" style="width: 50px; height: 50px"></div>
              <p id="sample" data-controller="datepicker">
                <label for="sampleInput"><span>sample</span></label>
                <input type="date" id="sampleInput" value="" max="9999-12-31" data-datepicker-target="input" data-action="click->datepicker#dispatch" size="10">
              </p>`;

suite('DatepickerDispatcherController', () => {

  let container;

  suite('Non-Mobile Environment', () => {

    let controller;

    setup(async () => {
      container = document.getElementById('container')
      const app = Application.start(container);
      await app.register('datepicker', class extends DatepickerController {
        initialize() {
          controller = this;
        }

        get isMobile() {
          return false;
        }
      });

      container.insertAdjacentHTML('afterbegin', html)
    });

    teardown(() => {
      const clone = container.cloneNode(false);
      container.parentNode.replaceChild(clone, container);
    });

    test('picker is hidden by default', () => {
      const picker = container.querySelector('#sample wc-datepicker')
      assert.isNotTrue(isVisible(picker));
    });

    suite('When Datepicker is displayed', () => {
      let input
      setup(() => {
        input  = container.querySelector('input#sampleInput')
        input.click();
      })

      test('click on input to display the datepicker', () => {
        const picker = container.querySelector('#sample wc-datepicker')
        assert.equal(picker.style.display, '');
      });

      test('click on outside of the datepicker to hide the datepicker', () => {
        const callback = (mutations) => {
          mutations.forEach(mut => {
            if (mut.target.matches('wc-datepicker') && mut.attributeName === 'style') {
              assert.equal(mut.target.style.display, 'none');
            }
          })
        }
        const observer = new MutationObserver(callback);

        const outside = container.querySelector('#outsideOfPicker')
        const picker = container.querySelector('#sample wc-datepicker')
        observer.observe(container, { attributes: true, subtree: true })
        outside.click();
      });

      test('Clicking on Datepicker does not hide it', (done) => {
        const picker  = container.querySelector('#sample wc-datepicker')
        waitForElement(picker.el, '.wc-datepicker__weekday')
          .then(element => {
            element.click();
            const picker = element.closest('wc-datepicker')
            return element;
          })
          .then(element => {
            const picker = element.closest('wc-datepicker')
            assert.equal(picker.style.display, '');
            done();
          })
      });

      test('Clicking on a date sets the value', (done) => {
        const picker  = container.querySelector('#sample wc-datepicker')
        waitForElement(picker.el, '.wc-datepicker__date')
          .then(element => {
            element.click();
            return element;
          })
          .then(element => {
            const picker = element.closest('wc-datepicker')
            assert.equal(picker.style.display, 'none');
            assert.isNotEmpty(input.value);
            done();
          })
      });
    })
  });

  suite('Mobile environment', () => {
    setup(async () => {
      container = document.getElementById('container')
      const app = Application.start(container);
      await app.register('datepicker', class extends DatepickerController {
        get isMobile() {
          return true;
        }
      });

      container.insertAdjacentHTML('afterbegin', html)
    });

    teardown(() => {
      const clone = container.cloneNode(false);
      container.parentNode.replaceChild(clone, container);
    });

    test('no datepicker is generated', () => {
      const picker = container.querySelector('wc-datepicker')
      assert.isNull(picker);
    });
  });
});

function waitForElement(target, selector, timeout) {
  const timeoutOption = timeout || 2000; // 2s
  const loopTime = 100;
  const limitCount = timeoutOption / loopTime;
  const limitCountOption = (limitCount < 1) ? 1 : limitCount;
  let   tryCount = 0;

  const tryCheck = (resolve, reject) => {
    if (tryCount < limitCountOption) {
      const element = target.querySelector(selector);
      if (element != null) {
        return resolve(element);
      }
      setTimeout(() => {
        tryCheck(resolve, reject);
      }, loopTime);
    } else {
      reject(new Error(`Not found element match the selector: ${selector}`));
    }
    tryCount++;
  }

  return new Promise((resolve, reject) => {
    tryCheck(resolve, reject);
  });
}
