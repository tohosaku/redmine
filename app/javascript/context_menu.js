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
        const ws   = window_size();

        const isReverseX  = (mouse_x + 2 * rect.width) > ws.width
        const lengthX     = calcPosition(mouse_x, rect.width, isReverseX);

        this.applyPosition({ length: lengthX, position: 'left', className: 'reverse_x' });

        const isReverseY  = (mouse_y_c + rect.height) > ws.height;
        const lengthY     = calcPosition(mouse_y, rect.height, isReverseY);

        this.applyPosition({ length: lengthY, position: 'top', className: 'reverse_y' });

        const direction   = calcDirection(ws.height, mouse_y_c, isReverseY);
        if (direction) {
          this.element.querySelectorAll('.folder').forEach(el => el.classList.add(direction));
        }

        this.element.style.display = '';
      });
  }

  hide() {
    this.element.style.display = 'none';
  }

  applyPosition({ length, position, className }) {
    this.element.classList.add(className)
    this.element.style[position] = `${length}px`;
  }
}

function calcPosition(pos, menuSize, isReverse) {
  return adjustLessThanZero(isReverse ? pos - menuSize : pos);
}

function calcDirection(height, mouse_y_c, isReverseY) {
  return isReverseY ? mouse_y_c          < 325 ? 'down'
                                               : undefined
                    : height - mouse_y_c < 345 ? 'up'
                                               : undefined;
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
