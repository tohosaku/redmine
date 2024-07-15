/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { get } from '@rails/request.js'
import { isVisible } from 'helper'

const selectionClass = 'context-menu-selection'

export class Menu {
  constructor(element) {
    this.element = element;
  }

  show({ pageX: mouse_x, pageY: mouse_y, clientY: mouse_y_c, target: target }) {
    this.element.style.left = `${mouse_x}px`;
    this.element.style.top  = `${mouse_y}px`;
    this.element.innerHTML = '';

    const form = target.closest('form');
    const url  = form.dataset.cmUrl;
    if (url == null) {alert('no url'); return;}

    get(
      url, {
        query: new FormData(form)
      }).then(res => {
        if (res.ok) {
          return res.html
        }
      }).then(data => {
        this.element.innerHTML = data;
        const rect = this.element.getBoundingClientRect();

        const menu_width     = rect.width;
        const menu_height    = rect.height;
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
        action_x(this.element);
        action_y(this.element);
        // adding class for submenu
        action_submenu(this.element);

        this.element.style.display = '';
      });
  }

  hide() {
    this.element.style.display = 'none';
  }
}

export function rightClick(menu, event) {
  const target = event.target;
  if (target.matches('a:not(.js-contextmenu)')) return;

  const tr = target.closest('.hascontextmenu');
  if (tr === null) return;
  event.preventDefault();

  if (!isSelected(tr)) {
    unselectAll();
    addSelection(tr);
    setLastSelected(tr);
  }
  menu.show(event);
}

export function click(menu, event) {
  const target = event.target;

  if ((target.matches('a') && target.classList.contains('submenu')) || (target.matches('a') && typeof target.dataset['turbo-method'] !== 'undefined')) {
    event.preventDefault();
    return;
  }
  menu.hide();
  if (target.matches('a') || target.matches('img')) return;

  if (event.which == 1 || (navigator.appVersion.match(/\bMSIE\b/))) {
    const tr = target.closest('.hascontextmenu');
    if (tr !== null) {
      // a row was clicked
      selectRows(target, tr, event);
    } else {
      // click is outside the rows
      if (target.matches('a') && (target.classList.contains('disabled') || target.classList.contains('submenu'))) {
        event.preventDefault();
      } else if (target.matches('.toggle-selection') || target.matches('.ui-dialog *') || isVisible(document.getElementById('ajax-modal'))) {
        // nop
      } else {
        unselectAll();
      }
    }
  }
}

export function selectRows(element, row, { ctrlKey, metaKey, shiftKey } ) {
  let target = element;
  if (target.matches('td.checkbox')) {
    // the td containing the checkbox was clicked, toggle the checkbox
    target = target.querySelector('input');
    target.checked = !target.checked;
  }
  if (target.matches('input')) {
    // a checkbox may be clicked
    row.classList.toggle(selectionClass, target.checked)
  } else {
    if (ctrlKey || metaKey) {
      toggleSelection(row);
      clearDocumentSelection();
    } else if (shiftKey) {
      const lastSelected = getLastSelected();
      if (lastSelected.length) {
        const rows = document.querySelectorAll('.hascontextmenu')
        const selected = addMultipleSelection(rows, lastSelected, row);
        selected.forEach(e => addSelection(e));
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

export function addMultipleSelection(rows, lastSelected, clicked) {
  let toggling = false;
  const selected = [];
  rows.forEach((elm) => {
    if (elm !== lastSelected && (toggling || elm === clicked)) {
      selected.push(elm);
      clearDocumentSelection();
    }
    if ((elm === lastSelected) !== (elm === clicked)) {
      toggling = !toggling;
    }
  });
  return selected;
}

export function reverseRenderAction({ render_pos, menu_size, position, class_name }) {
  return element => {
    element.classList.add(class_name)
    const n = adjustLessThanZero(render_pos - menu_size);
    element.style[position] = `${n}px`;
  }
}

export function normalRenderAction({ render_pos, menu_size, position, class_name }) {
  return element => {
    element.classList.remove(class_name);
    const n = adjustLessThanZero(render_pos);
    element.style[position] = `${n}px`;
  }
}

export function reverseFolderAction({ window_height, mouse_y_c }) {
  return element => {
    if (mouse_y_c < 325) {
      element.querySelectorAll('.folder').forEach(el => el.classList.add('down'));
    }
  }
}

export function normalFolderAction({ window_height, mouse_y_c }) {
  return element => {
    if (window_height - mouse_y_c < 345) {
      element.querySelectorAll('.folder').forEach(el => el.classList.add('up'));
    }
  }
}

function adjustLessThanZero(n) {
  return n <= 0 ? 1 : n;
}

function setLastSelected(row) {
  document.querySelectorAll('.cm-last').forEach((el) => {
    el.classList.remove('cm-last')
  });
  row.classList.add('cm-last');
}

function getLastSelected() {
  return document.querySelector('.cm-last');
}

export function unselectAll() {
  document.querySelectorAll('input[type=checkbox].toggle-selection').forEach(cb => cb.checked = false);
  document.querySelectorAll('.hascontextmenu').forEach((el) => {
    removeSelection(el);
  });
  document.querySelectorAll('.cm-last').forEach((el) => {
    el.classList.remove('cm-last')
  });
}

function toggleSelection(row) {
  if (isSelected(row)) {
    removeSelection(row);
  } else {
    addSelection(row);
  }
}

function addSelection(row) {
  row.classList.add(selectionClass);
  checkSelectionBox(row, true);
}

function removeSelection(row) {
  row.classList.remove(selectionClass);
  checkSelectionBox(row, false);
}

function isSelected(row) {
  return row.classList.contains(selectionClass);
}

function checkSelectionBox(row, checked) {
  row.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = checked
  });
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
  const target = event.target;
  const checked = target.checked;
  const boxes   = target.closest('table').querySelectorAll('input[name=ids[]]');
  boxes.forEach(cb => {
    cb.checked = checked;
    cb.closest('.hascontextmenu').classList.toggle(selectionClass, checked);
  });
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
