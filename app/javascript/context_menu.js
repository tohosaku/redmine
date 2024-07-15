/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { get } from '@rails/request.js'

let observing;

export function rightClick(event) {
  const target = $(event.target);
  if (target.is('a:not(.js-contextmenu)')) {return;}

  const tr = target.closest('.hascontextmenu').first();
  if (tr.length < 1) {return;}
  event.preventDefault();

  if (!isSelected(tr)) {
    unselectAll();
    addSelection(tr);
    setLastSelected(tr);
  }
  show(event);
}

export function click(event) {
  const target = $(event.target);

  if ((target.is('a') && target.hasClass('submenu')) || (target.is('a') && typeof target.data('turbo-method') !== 'undefined')) {
    event.preventDefault();
    return;
  }
  hide();
  if (target.is('a') || target.is('img')) { return; }

  if (event.which == 1 || (navigator.appVersion.match(/\bMSIE\b/))) {
    const tr = target.closest('.hascontextmenu').first();
    if (tr.length > 0) {
      // a row was clicked
      selectRows(target, tr, event);
    } else {
      // click is outside the rows
      if (target.is('a') && (target.hasClass('disabled') || target.hasClass('submenu'))) {
        event.preventDefault();
      } else if (target.is('.toggle-selection') || target.is('.ui-dialog *') || $('#ajax-modal').is(':visible')) {
        // nop
      } else {
        unselectAll();
      }
    }
  }
}

export function selectRows($element, row, { ctrlKey, metaKey, shiftKey } ) {
  let $target = $element;
  if ($target.is('td.checkbox')) {
    // the td containing the checkbox was clicked, toggle the checkbox
    $target = $target.find('input').first();
    $target.prop("checked", !$target.prop("checked"));
  }
  if ($target.is('input')) {
    // a checkbox may be clicked
    row.toggleClass('context-menu-selection', $target.prop('checked'))
  } else {
    if (ctrlKey || metaKey) {
      toggleSelection(row);
      clearDocumentSelection();
    } else if (shiftKey) {
      const lastSelected = getLastSelected();
      if (lastSelected.length) {
        const selected = addMultipleSelection($('.hascontextmenu'), lastSelected, row);
        selected.forEach($e => addSelection($e));
      } else {
        addSelection(row);
      }
    } else {
      unselectAll();
      addSelection(row);
    }
    setLastSelected(row);
  }
}

export function addMultipleSelection($rows, lastSelected, clicked) {
  let toggling = false;
  const selected = [];
  $rows.each((i, elm) => {
    const $elm = $(elm);
    if (!$elm.is(lastSelected) && (toggling || $elm.is(clicked))) {
      selected.push($elm);
      clearDocumentSelection();
    }
    if ($elm.is(lastSelected) !== $elm.is(clicked)) {
      toggling = !toggling;
    }
  });
  return selected;
}

function show({ pageX: mouse_x, pageY: mouse_y, clientY: mouse_y_c, target: target }) {
  const $element = $('#context-menu');
  $element.css({ left: `${mouse_x}px`, top: `${mouse_y}px` });
  $element.html('');

  const form = $(target).parents('form').first();
  const url  = form.data('cm-url');
  if (url == null) {alert('no url'); return;}

  get(
    url, {
      query: new FormData(form.get(0))
    }).then(res => {
    if (res.ok) {
      return res.html
    }
  }).then(data => {
    $element.html(data);

    const menu_width     = $element.width();
    const menu_height    = $element.height();
    const max_width      = mouse_x   + 2 * menu_width;
    const max_height     = mouse_y_c + menu_height;
    const ws             = window_size();

    const is_reverse_x   = max_width > ws.width;
    const arg_x          = { render_pos: mouse_x, menu_size: menu_width, position: 'left', class_name: 'reverse_x' }
    const action_x       = is_reverse_x ? reverseRenderAction(arg_x)
                                        : normalRenderAction(arg_x);

    const is_reverse_y   = max_height > ws.height;
    const arg_y          = { render_pos: mouse_y, menu_size: menu_height, position: 'top', class_name: 'reverse_y' }
    const action_y       = is_reverse_y ? reverseRenderAction(arg_y)
                                        : normalRenderAction(arg_y);

    const arg_submenu    = { window_height: ws.height, mouse_y_c }
    const action_submenu = is_reverse_y ? reverseFolderAction(arg_submenu)
                                        : normalFolderAction(arg_submenu);
    action_x($element);
    action_y($element);
    // adding class for submenu
    action_submenu($element);

    $element.show();
  });
}

export function reverseRenderAction({ render_pos, menu_size, position, class_name }) {
  return element => {
    element.addClass(class_name)
    const n = adjustLessThanZero(render_pos - menu_size);
    element.css(position, `${n}px`);
  }
}

export function normalRenderAction({ render_pos, menu_size, position, class_name }) {
  return element => {
    element.removeClass(class_name);
    const n = adjustLessThanZero(render_pos);
    element.css(position, `${n}px`);
  }
}

export function reverseFolderAction({ window_height, mouse_y_c }) {
  return element => {
    if (mouse_y_c < 325) {
      element.find('.folder').addClass('down');
    }
  }
}

export function normalFolderAction({ window_height, mouse_y_c }) {
  return element => {
    if (window_height - mouse_y_c < 345) {
      element.find('.folder').addClass('up');
    }
  }
}

function adjustLessThanZero(n) {
  return n <= 0 ? 1 : n;
}

function setLastSelected(tr) {
  $('.cm-last').removeClass('cm-last');
  tr.addClass('cm-last');
}

function getLastSelected() {
  return $('.cm-last').first();
}

export function unselectAll() {
  $('input[type=checkbox].toggle-selection').prop('checked', false);
  $('.hascontextmenu').each((i, el) => {
    removeSelection($(el));
  });
  $('.cm-last').removeClass('cm-last');
}

function hide() {
  $('#context-menu').hide();
}

function toggleSelection(tr) {
  if (isSelected(tr)) {
    removeSelection(tr);
  } else {
    addSelection(tr);
  }
}

function addSelection(tr) {
  tr.addClass('context-menu-selection');
  checkSelectionBox(tr, true);
}

function removeSelection(tr) {
  tr.removeClass('context-menu-selection');
  checkSelectionBox(tr, false);
}

function isSelected(tr) {
  return tr.hasClass('context-menu-selection');
}

function checkSelectionBox(tr, checked) {
  tr.find('input[type=checkbox]').prop('checked', checked);
}

function clearDocumentSelection() {
  // TODO
  if (document.selection) {
    document.selection.empty(); // IE
  } else {
    window.getSelection().removeAllRanges();
  }
}

export function toggleIssuesSelection(event) {
  const $target = $(event.target)
  const checked = $target.prop('checked');
  const boxes   = $target.parents('table').find('input[name=ids\\[\\]]');
  boxes.prop('checked', checked).parents('.hascontextmenu').toggleClass('context-menu-selection', checked);
}

function window_size() {
  let w;
  let h;
  if (window.innerWidth) {
    w = window.innerWidth;
    h = window.innerHeight;
  } else if (document.documentElement) {
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;
  } else {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
  }
  return {width: w, height: h};
}
