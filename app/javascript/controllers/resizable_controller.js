import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="resizable"
export default class extends Controller {
  static values = { minWidth: Number, zindex: String }
  static classes = ['handle'] // '.resizable-handle'

  connect() {
    this.element.style.position = 'relative';
    this.element.zIndex = this.zindexValue;
    this.additional = this.element.dataset.alsoResize ? Array.from(document.querySelectorAll(this.element.dataset.alsoResize))
                                                      : []
    this.curAdd = []
  }

  start(e) {
    if (!this.isHandle(e.target)) return;

    this.pageX = e.pageX;
    e.target.setPointerCapture(e.pointerId);
    this.curWidth = this.getWidth(this.element)
    this.curAdd   = this.additional.map(elem => ({ element: elem, width: this.getWidth(elem)}));
  }

  resize(e) {
    if (!this.isHandle(e.target)) return;

    const diff  = e.pageX - this.pageX
    const width = this.curWidth + diff;

    if (this.hasMinWidthValue && width < this.minWidthValue) return;

    this.element.style.width = `${width}px`;
    this.curAdd.forEach(a => {
      a.element.style.width = `${a.width + diff}px`;
    })
  }

  end(e) {
    if (!this.isHandle(e.target)) return;

    this.pageX = undefined;
    this.curWidth = undefined
  }

  enter(e) {
    if (!this.isHandle(e.target)) return;

    if (typeof this.element.dataset.resizingStyle !== 'undefined') {
      // style of lines to be resized
      e.target.style.borderRight = this.element.dataset.resizingStyle;
    }
  }

  leave(e) {
    if (!this.isHandle(e.target)) return;

    e.target.style.borderRight = '';
  }

  getWidth(element) {
    const padding = this.paddingDiff(element);
    return element.offsetWidth - padding;
  }

  paddingDiff(col) {

    if (this.getStyleVal(col,'box-sizing') == 'border-box'){
      return 0;
    }

    const padLeft = this.getStyleVal(col,'padding-left');
    const padRight = this.getStyleVal(col,'padding-right');
    return (parseInt(padLeft) + parseInt(padRight));
  }

  getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css)
  }

  isHandle(element) {
    return element.classList.contains(this.handleClass);
  }
}
