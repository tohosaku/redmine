import { selectRows, addMultipleSelection,reverseRenderAction, normalRenderAction, reverseFolderAction, normalFolderAction } from 'context_menu';
import { assert } from 'chai'

const html = `<!-- test for row clicking -->
  <table>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
    <tr class="hascontextmenu"><td class="checkbox"><input type="checkbox"/></td><td class="noinput"></td></tr>
  </table>
  <!-- test for size and position of menu -->
  <div id="menu">
    <div class="folder"></div>
    <div class="folder"></div>
  </div>`

suite('context menu', () => {

  suite('when a row is clicked', async () => {
    let $rows;

    setup(() => {
      document.getElementById('container').insertAdjacentHTML('afterbegin', html);
      $rows = $('.hascontextmenu');
    });

    teardown(() => {
      const container = document.getElementById('container');
      const clone = container.cloneNode( false );

      container.parentNode.replaceChild( clone , container );
    });

    test('When the checkbox is clicked directly, select the row', () => {
      const target = $($rows[0]).find('input');
      target.prop('checked', true);
      const tr     = target.closest('.hascontextmenu').first();
      selectRows(target, tr, {} )
      assert.isTrue(tr.hasClass('context-menu-selection'));
    });

    test('When the td containing the checkbox is clicked, toggle the checkbox and select the row', () => {
      const target = $($rows[0]).find('td.checkbox');
      const tr     = target.closest('.hascontextmenu').first();
      selectRows(target, tr, {} )
      assert.isTrue(target.find('input').prop('checked'));
      assert.isTrue(tr.hasClass('context-menu-selection'));
    });

    test('When the td not containing the checkbox is clicked with no modifier, toggle the checkbox and select the row', () => {
      const target0 = $($rows[0]).find('td.noinput');
      const tr0     = target0.closest('.hascontextmenu').first();
      selectRows(target0, tr0, {} )
      assert.isTrue(tr0.find('input').prop('checked'));
      assert.isTrue(tr0.hasClass('context-menu-selection'));

      const target1 = $($rows[1]).find('td.noinput');
      const tr1     = target1.closest('.hascontextmenu').first();
      selectRows(target1, tr1, {} )

      assert.isFalse(tr0.find('input').prop('checked'));
      assert.isFalse(tr0.hasClass('context-menu-selection'));

      assert.isTrue(tr1.find('input').prop('checked'));
      assert.isTrue(tr1.hasClass('context-menu-selection'));
    });

    test('When the td not containing the checkbox is clicked with ctrl key, toggle the checkbox and select the row', () => {
      const target0 = $($rows[0]).find('td.noinput');
      const tr0     = target0.closest('.hascontextmenu').first();
      selectRows(target0, tr0, {} )
      assert.isTrue(tr0.find('input').prop('checked'));
      assert.isTrue(tr0.hasClass('context-menu-selection'));

      const target3 = $($rows[3]).find('td.noinput');
      const tr3     = target3.closest('.hascontextmenu').first();
      selectRows(target3, tr3, {ctrlKey:true} )

      assert.isTrue(tr0.find('input').prop('checked'));
      assert.isTrue(tr0.hasClass('context-menu-selection'));

      assert.isTrue(tr3.find('input').prop('checked'));
      assert.isTrue(tr3.hasClass('context-menu-selection'));
    });
  });

  suite('With shift key + left click, multiple rows can be selected ', () => {

    let $rows;

    setup(() => {
      document.getElementById('container').insertAdjacentHTML('afterbegin', html);

      $rows = $('.hascontextmenu');
    });

    teardown(() => {
      const container = document.getElementById('container');
      const clone = container.cloneNode( false );

      container.parentNode.replaceChild( clone , container );
    });

    test('The last selected row is lower than the clicked', () => {
      const selected = addMultipleSelection($rows, $rows[5], $rows[0]);
      assert.equal(selected.length, 5);
    });

    test('The last selected row is above the clicked', () => {
      const selected = addMultipleSelection($rows, $rows[0], $rows[5]);
      assert.equal(selected.length, 5);
    });

    test('The last selected row is same as the clicked', () => {
      const selected = addMultipleSelection($rows, $rows[0], $rows[0]);
      assert.equal(selected.length, 0);
    });
  });

  suite('get context menu position', () => {

    let $element;

    setup(() => {
      document.getElementById('container').insertAdjacentHTML('afterbegin', html);

      const div = document.getElementById('menu');
      $element = $(div);
    });

    teardown(() => {
      const container = document.getElementById('container');
      const clone = container.cloneNode( false );

      container.parentNode.replaceChild( clone , container );
    });

    test('reverseRenderAction returns function to change DOM Element', () => {
      const obj = { render_pos: 100, menu_size: 50, position: 'left', class_name: 'reverse-x' }
      const action = reverseRenderAction(obj);
      action($element);
      assert.isTrue($element.hasClass('reverse-x'));
      assert.equal('50px', $element.css('left'));
    });

    test('normalRenderAction returns function to change DOM Element', () => {
      const obj = { render_pos: 100, menu_size: 50, position: 'left', class_name: 'reverse-x' }
      const action = normalRenderAction(obj);
      action($element);
      assert.isFalse($element.hasClass('reverse-x'));
      assert.equal('100px', $element.css('left'));
    });

    test('reverseFolderAction returns funtion to change submenu element', () => {
      const obj = { window_height: 100, mouse_y_c: 100 }
      const action = reverseFolderAction(obj)
      action($element);
      assert.isTrue($element.find('.folder').toArray().every(e => e.classList.contains('down')));
    });

    test('reverseFolderAction returns funtion that dont change submenu element', () => {
      const obj = { window_height: 100, mouse_y_c: 325 }
      const action = reverseFolderAction(obj)
      action($element);
      assert.isTrue($element.find('.folder').toArray().every(e => !e.classList.contains('down')));
    });

    test('normalFolderAction returns funtion to change submenu element', () => {
      const obj = { window_height: 100, mouse_y_c: 100 }
      const action = normalFolderAction(obj)
      action($element);
      assert.isTrue($element.find('.folder').toArray().every(e => e.classList.contains('up')));
    });

    test('normalFolderAction returns funtion that dont change submenu element', () => {
      const obj = { window_height: 445, mouse_y_c: 100 }
      const action = normalFolderAction(obj)
      action($element);
      assert.isTrue($element.find('.folder').toArray().every(e => !e.classList.contains('up')));
    });
  });
});

