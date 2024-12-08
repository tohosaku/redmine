/**
 * This file is part of DotClear.
 * Copyright (c) 2005 Nicolas Martin & Olivier Meunier and contributors. All rights reserved.
 * This code is released under the GNU General Public License.
 *
 * Modified by JP LANG for multiple text formatting
 */
import { get } from '@rails/request.js'

let lastJstPreviewed = null;
const isMac = Boolean(navigator.platform.toLowerCase().match(/mac/));

export default class jsToolBar {
  constructor(controller, elements) {
    if (!controller) { return; }

    this.textarea     = controller.editorTarget;
    this.toolbarBlock = controller.element
    this.editor       = controller.mainTarget;
    this.preview      = controller.previewTarget;
    this.tabsBlock    = controller.tabsTarget;
    this.elements     = elements;

    const preview_id = `preview_${this.textarea.getAttribute('id')}`
    this.preview.setAttribute('id', preview_id)

    this.editTab = controller.edittabTarget;
    jsTabname(this.editTab, 'Edit')

    this.previewTab = controller.previewtabTarget;
    jsTabname(this.previewTab, 'Preview')

    this.toolbar = controller.elementsTarget;

    // Dragable resizing
    if (typeof this.editor !== 'undefined' && this.editor.addEventListener && navigator.appVersion.match(/\bMSIE\b/))
    {
      this.handle = document.createElement('div');
      this.handle.className = 'jstHandle';
      this.handle.addEventListener('mousedown',(event) => { this.resizeDragStart(event); },false);
      // fix memory leak in Firefox (bug #241518)
      window.addEventListener('unload',() => {
        const del = this.handle.parentNode.removeChild(this.handle);
        delete(this.handle);
      },false);

      this.editor.parentNode.insertBefore(this.handle,this.editor.nextSibling);
    }

    this.context = null;
    this.toolNodes = {}; // lorsque la toolbar est dessinée , cet objet est garni
                         // de raccourcis vers les éléments DOM correspondants aux outils.
    this.base_url = '';
    this.mode = 'wiki';
    this.help_link = '';
    this.shortcuts = {};
    this.buttons = {}
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode || 'wiki';
  }

  switchMode(mode) {
    mode = mode || 'wiki';
    this.draw(mode);
  }

  setHelpLink(link) {
    this.help_link = link;
  }

  showHelp() {
    get(this.help_link, { responseKind: 'turbo-stream' });
  }

  setPreviewUrl(url) {
    this.previewTab.firstChild.setAttribute('data-url', url);
  }

  button(tool) {
    if (typeof tool.fn[this.mode] != 'function') return null;

    const className = 'jstb_' + tool.name;
    let title = tool.title

    if (tool.hasOwnProperty('shortcut')) {
      this.shortcuts[tool.shortcut] = className;
      title = this.buttonTitleWithShortcut(tool.title, tool.shortcut)
    }

    const b = new jsButton(title, tool.fn[this.mode], this, className, tool.name);
    if (tool.icon != undefined) b.icon = tool.icon;

    return b;
  }

  buttonTitleWithShortcut(title, shortcutKey) {
    if(typeof jsToolBar.strings == 'undefined') {
      var i18nTitle = title || null;
    } else {
      var i18nTitle = jsToolBar.strings[title.toLowerCase()] || title || null;
    }

    if (isMac) {
      return i18nTitle + " (⌘" + shortcutKey.toUpperCase() + ")";
    } else {
      return i18nTitle + " (Ctrl+" + shortcutKey.toUpperCase() + ")";
    }
  }

  space(tool) {
    var space = new jsSpace(tool.name)
    if (tool.width !== undefined)
      space.width = tool.width;
    return space;
  }

  combo(toolName) {
    var tool = this.elements[toolName];
    var length = tool[this.mode].list.length;

    if (typeof tool[this.mode].fn != 'function' || length == 0) {
      return null;
    } else {
      var options = {};
      for (var i=0; i < length; i++) {
        var opt = tool[this.mode].list[i];
        options[opt] = tool.options[opt];
      }
      return new jsCombo(tool.title, options, this, tool[this.mode].fn);
    }
  }

  draw(mode) {
    this.setMode(mode);

    // Empty toolbar
    while (this.toolbar.hasChildNodes()) {
      this.toolbar.removeChild(this.toolbar.firstChild)
    }
    this.toolNodes = {}; // vide les raccourcis DOM/**/
    this.buttons = {}

    // Draw toolbar elements
    var b, tool, newTool;

    this.elements.forEach(b => {
      var disabled =
      b.type == undefined || b.type == ''
      || (b.disabled != undefined && b.disabled)
      || (b.context != undefined && b.context != null && b.context != this.context);

      if (!disabled && typeof this[b.type] == 'function') {
        tool = this[b.type](b);
        if (tool) newTool = tool.draw();
        if (newTool) {
          this.toolNodes[b.name] = newTool; //mémorise l'accès DOM pour usage éventuel ultérieur
          this.toolbar.appendChild(newTool);
        }
        if (b.type == 'button') {
          this.buttons[b.name] = tool;
        }
      }
    })
  }

  singleTag(stag,etag) {
    stag = stag || null;
    etag = etag || stag;

    if (!stag || !etag) { return; }

    this.encloseSelection(stag,etag);
  }

  encloseLineSelection(prefix, suffix, fn) {
    this.textarea.focus();

    prefix = prefix || '';
    suffix = suffix || '';

    var start, end, sel, scrollPos, subst, res;

    if (typeof(document["selection"]) != "undefined") {
      sel = document.selection.createRange().text;
    } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
      start = this.textarea.selectionStart;
      end = this.textarea.selectionEnd;
      scrollPos = this.textarea.scrollTop;
      // go to the start of the line
      start = this.textarea.value.substring(0, start).replace(/[^\r\n]*$/g,'').length;
      // go to the end of the line
      end = this.textarea.value.length - this.textarea.value.substring(end, this.textarea.value.length).replace(/^[^\r\n]*/, '').length;
      sel = this.textarea.value.substring(start, end);
    }

    if (sel.match(/ $/)) { // exclude ending space char, if any
      sel = sel.substring(0, sel.length - 1);
      suffix = suffix + " ";
    }

    if (typeof(fn) == 'function') {
      res = (sel) ? fn.call(this,sel) : fn('');
    } else {
      res = (sel) ? sel : '';
    }

    subst = prefix + res + suffix;

    if (typeof(document["selection"]) != "undefined") {
      document.selection.createRange().text = subst;
      var range = this.textarea.createTextRange();
      range.collapse(false);
      range.move('character', -suffix.length);
      range.select();
    } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
      this.textarea.value = this.textarea.value.substring(0, start) + subst +
      this.textarea.value.substring(end);
      if (sel || (!prefix && start === end)) {
        this.textarea.setSelectionRange(start + subst.length, start + subst.length);
      } else {
        this.textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
      this.textarea.scrollTop = scrollPos;
    }
  }

  encloseSelection(prefix, suffix, fn) {
    this.textarea.focus();
    prefix = prefix || '';
    suffix = suffix || '';

    var start, end, sel, scrollPos, subst, res;

    if (typeof(document["selection"]) != "undefined") {
      sel = document.selection.createRange().text;
    } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
      start = this.textarea.selectionStart;
      end = this.textarea.selectionEnd;
      scrollPos = this.textarea.scrollTop;
      sel = this.textarea.value.substring(start, end);
      if (start > 0 && this.textarea.value.substr(start-1, 1).match(/\S/)) {
        prefix = ' ' + prefix;
      }
      if (this.textarea.value.substr(end, 1).match(/\S/)) {
        suffix = suffix + ' ';
      }
    }
    if (sel.match(/ $/)) { // exclude ending space char, if any
      sel = sel.substring(0, sel.length - 1);
      suffix = suffix + " ";
    }

    if (typeof(fn) == 'function') {
      res = (sel) ? fn.call(this,sel) : fn('');
    } else {
      res = (sel) ? sel : '';
    }

    subst = prefix + res + suffix;

    if (typeof(document["selection"]) != "undefined") {
      document.selection.createRange().text = subst;
      var range = this.textarea.createTextRange();
      range.collapse(false);
      range.move('character', -suffix.length);
      range.select();
//      this.textarea.caretPos -= suffix.length;
    } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
      this.textarea.value = this.textarea.value.substring(0, start) + subst +
      this.textarea.value.substring(end);
      if (sel) {
        this.textarea.setSelectionRange(start + subst.length, start + subst.length);
      } else {
        this.textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
      this.textarea.scrollTop = scrollPos;
    }
  }

  execute(event) {
    const name = event.target.dataset.toolName;
    const button = this.buttons[name];
    if (typeof func !== undefined) {
      button.execute()
    }
  }

  showPreview(event) {
    if (event.target.classList.contains('selected')) { return; }
    lastJstPreviewed = this.toolbarBlock;
    this.preview.setAttribute('style', 'min-height: ' + this.textarea.clientHeight + 'px;')
    this.toolbar.classList.add('hidden');
    this.textarea.classList.add('hidden');
    this.preview.classList.remove('hidden');
    this.tabsBlock.querySelector('.tab-edit').classList.remove('selected');
    event.target.classList.add('selected');
  }

  hidePreview(event) {
    if (event.target.classList.contains('selected')) { return; }
    this.toolbar.classList.remove('hidden');
    this.textarea.classList.remove('hidden');
    this.textarea.focus();
    this.preview.classList.add('hidden');
    this.tabsBlock.querySelector('.tab-preview').classList.remove('selected');
    event.target.classList.add('selected');
  }

  keyboardShortcuts(e) {
    let stop = false;
    if (isToogleEditPreviewShortcut(e)) {
      // Switch to preview only if Edit tab is selected when the event triggers.
      if (this.tabsBlock.querySelector('.tab-edit.selected')) {
        stop = true
        this.tabsBlock.querySelector('.tab-preview').click();
      }
    }
    if (isModifierKey(e) && this.shortcuts.hasOwnProperty(e.key.toLowerCase())) {
      stop = true
      this.toolbar.querySelector("." + this.shortcuts[e.key.toLowerCase()]).click();
    }
    if (stop) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  stripBaseURL(url) {
    if (this.base_url != '') {
      var pos = url.indexOf(this.base_url);
      if (pos == 0) {
        url = url.substr(this.base_url.length);
      }
    }

    return url;
  }
  /** Resizer
  -------------------------------------------------------- */
  resizeSetStartH() {
    this.dragStartH = this.textarea.offsetHeight + 0;
  }

  resizeDragStart(event) {
    this.dragStartY = event.clientY;
    this.resizeSetStartH();
    document.addEventListener('mousemove', this.dragMoveHdlr=(event) => {this.resizeDragMove(event);}, false);
    document.addEventListener('mouseup', this.dragStopHdlr=(event) => {this.resizeDragStop(event);}, false);
  }

  resizeDragMove(event) {
    this.textarea.style.height = (this.dragStartH+event.clientY-this.dragStartY)+'px';
  }

  resizeDragStop(event) {
    document.removeEventListener('mousemove', this.dragMoveHdlr, false);
    document.removeEventListener('mouseup', this.dragStopHdlr, false);
  }

  /* Code highlighting menu */
  precodeMenu(fn){
    const menu = this.createMenuElement('precode', 'code-highlighting-template', fn);
    return false;
  }

  /* Table generator */
  tableMenu(fn){
    const menu = this.createMenuElement('table', 'table-generator-template', fn);
    return false;
  }

  createMenuElement(name, templateId, fn) {
    const template = document.getElementById(templateId);
    const fragment = template.content.cloneNode(true);
    const menu = document.body.appendChild(fragment.firstElementChild);

    const rect = this.toolNodes[name].getBoundingClientRect();
    menu.style.top  = `${rect.bottom + window.pageYOffset}px`;
    menu.style.left = `${rect.left + window.pageXOffset}px`;
    menu.addMenu = fn;

    return menu;
  }

  togglePreview(e) {
    if (isToogleEditPreviewShortcut(e)) {
      if (lastJstPreviewed !== null) {
        e.preventDefault();
        e.stopPropagation();
        lastJstPreviewed.querySelector('.tab-edit').click();
        lastJstPreviewed = null;
      }
    }
  }
}

function jsTabname(link, name) {
  const tabName = jsToolBar.strings[name.toLowerCase()] || name || null;
  if (typeof link !== 'undefined') {
    link.innerText = tabName;
  }
}

class jsTab {
  constructor(tab, name, selected) {
    selected = selected || false;
    if(typeof jsToolBar.strings == 'undefined') {
      var tabName = name || null;
    } else {
      var tabName = jsToolBar.strings[name] || name || null;
    }

    var tab = document.createElement('li');
    var link = document.createElement('a');
    link.setAttribute('href', '#');
    link.innerText = tabName;
    link.className = 'tab-' + name.toLowerCase();

    if (selected == true) {
      link.classList.add('selected');
    }
    tab.appendChild(link)

    return tab;
  }
}

class jsButton {

  constructor(title, fn, scope, className, name) {
    if(typeof jsToolBar.strings == 'undefined') {
      this.title = title || null;
    } else {
        this.title = jsToolBar.strings[name] || title || null;
    }
    this.fn = fn || function(){};
    this.scope = scope || null;
    this.className = className || null;
    this.name = name
  }

  draw() {
    if (!this.scope) return null;

    const button = document.createElement('button');
    button.setAttribute('type','button');
    button.tabIndex = 200;
    if (this.className) {
      button.className = this.className;
    }
    button.title = this.title;
    const span = document.createElement('span');
    span.appendChild(document.createTextNode(this.title));
    button.appendChild(span);
    button.dataset.toolName = this.name;

    if (this.icon != undefined) {
      button.style.backgroundImage = `url(${this.icon})`;
    }

    return button;
  }

  execute() {
    if (typeof(this.fn) == 'function') {
      try {
        this.fn.apply(this.scope, arguments)
      } catch (e) {
      }
    }
  }
}

class jsSpace {

  constructor(className) {
    this.className = className || null;
    this.width = null;
  }

  draw() {
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(String.fromCharCode(160)));
    span.className = 'jstSpacer' + (this.className ? ' ' + this.className : '');
    if (this.width) span.style.marginRight = this.width+'px';

    return span;
  }
}

class jsCombo {
  constructor(title, options, scope, fn, className) {
    this.title = title || null;
    this.options = options || null;
    this.scope = scope || null;
    this.fn = fn || function(){};
    this.className = className || null;
  }

  draw() {
    if (!this.scope || !this.options) return null;

    const select = document.createElement('select');
    if (this.className) select.className = className;
    select.title = this.title;

    this.options.forEach(o => {
      const option = document.createElement('option');
      option.value = o;
      option.appendChild(document.createTextNode(this.options[o]));
      select.appendChild(option);
    })

    select.addEventListener('change', (e) =>  {
      try {
        this.fn.call(this.scope, e.currentTarget.value);
      } catch (error) {
        alert(error);
      }

      return false;
    })

    return select;
  }
}

function isToogleEditPreviewShortcut(e) {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
    return true;
  } else {
    return false;
  }
}

function isModifierKey(e) {
  if (isMac && e.metaKey) {
    return true;
  } else if (!isMac && e.ctrlKey) {
    return true;
  } else {
    return false;
  }
}
