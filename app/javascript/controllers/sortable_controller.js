import { Controller } from "@hotwired/stimulus"

const sortableDragging = 'draggable__drag'

// Connects to data-controller="sortable"
export default class extends Controller {
  static targets = ['item']

  connect() {
    this.dragging   = new Dragging(this)
    this.releasing  = new Releasing(this)
    this.element['sortable_controller'] = this
    this.setState(this.releasing)
    this.dispatch('connect')
  }

  start(e) {
    this.state.start(e)
  }

  move(e) {
    if (typeof this.state !== 'undefined') {
      this.state.move(e)
    }
  }

  end(e) {
    this.state.end(e)
  }

  noop(e) {
    e.preventDefault()
  }

  setState(state) {
    this.state = state
  }
}

export class State {
  constructor(context) {
    this.context = context;
  }

  start(e) {}

  move(e) {}

  end(e) {}
}

export class Dragging extends State {
  move(e) {
    const coords   = getMouseCoords(e);
    const position = getPositionDiff(this.context.startCoords, coords);
    this.moveRow(this.context.itemTargets, position);
  }

  moveRow(items, {x, y}) {
    this.context.dragElement.style.transform = `translate(${x}px, ${y}px)`;

    const dRect   = this.context.dragElement.getBoundingClientRect();
    const dStartX = dRect.x
    const dEndX   = dStartX + dRect.width;
    const dStartY = dRect.y
    const dEndY   = dStartY + dRect.height;

    items.forEach((rowElem, i) => {
      const rowRect   = rowElem.getBoundingClientRect();
      const rowStartX = rowRect.x
      const rowEndX   = rowStartX + rowRect.width;
      const rowStartY = rowRect.y
      const rowEndY   = rowStartY + rowRect.height;

      if (this.context.placeholder !== rowElem && (isIntersecting(dStartX, dEndX, rowStartX, rowEndX) && isIntersecting(dStartY, dEndY, rowStartY, rowEndY))) {
        if (Math.abs(dStartY - rowStartY) < rowRect.height / 2) {
          const currIndex = items.indexOf(this.context.placeholder);
          this.swapRow(this.context.placeholder, currIndex, rowElem, i);
        }
      }
    })
  }

  swapRow(currRow, currIndex, row, index) {
    const row1 = currIndex > index ? currRow : row;
    const row2 = currIndex > index ? row : currRow;

    const index1 = row1.dataset.sortedIndex;
    const index2 = row2.dataset.sortedIndex;
    row1.dataset.sortedIndex = index2;
    row2.dataset.sortedIndex = index1;

    row2.insertAdjacentElement('beforebegin', row1);
  }

  end(e) {
    this.unselect(e)
  }

  unselect(e) {
    if (this.context.dragElement == null) return;

    this.setElement(this.context.placeholder, this.context.dragElement)
    restoreStyle(this.context.dragElement)
    Array.from(this.context.dragElement.children).forEach(elm => {
      restoreStyle(elm)
    })

    this.context.dispatch('sorted', { detail: this.context.dragElement })
    this.context.dragElement = null;

    this.context.setState(this.context.releasing)
  }

  setElement(current, element) {
    const index = current.dataset.sortedIndex
    current.replaceWith(element)

    element.setAttribute(`data-${this.context.identifier}-target`, 'item')
    element.classList.remove(sortableDragging)
    element.removeAttribute('style')
    element.dataset.sortedIndex = index;
  }

  get name() {
    return "dragging"
  }
}

export class Releasing extends State {

  start(e) {
    this.select(e)
  }

  select(e) {
    if (e.button != 0) return true;

    const handle = e.target.closest('.sort-handle')
    if (handle === null) return;

    const target = this.context.itemTargets.find(item => item.contains(e.target))
    if (typeof target !== 'undefined') {
      this.context.placeholder = target;
      this.context.dragElement = this.addDraggableElement(target);
      this.context.placeholder.classList.add('is-dragging');
      this.context.placeholder.style.visibility = 'hidden';
      this.context.dragElement.setPointerCapture(e.pointerId);

      this.context.startCoords = getMouseCoords(e);
      this.context.setState(this.context.dragging)
      this.context.dispatch('start')
    }
  }

  addDraggableElement(target) {
    const draggable = target.cloneNode(true);
    draggable.removeAttribute(`data-${this.context.identifier}-target`)
    draggable.classList.add(sortableDragging);

    copyStyles(target, draggable, ['height', 'width', 'background-color']);

    const styles = ['width', 'height', 'padding', 'margin']
    Array.from(target.children).forEach((oldTD, i) => {
      copyStyles(oldTD, draggable.children[i], styles);
    })

    const tPos = target.getBoundingClientRect();

    draggable.style.position = "fixed";
    draggable.style.top  = `${tPos.y - 3}px`
    draggable.style.left = `${tPos.x - 3}px`

    this.context.element.append(draggable);

    return draggable;
  }

  get name() {
    return "releasing"
  }
}

function isIntersecting(min0, max0, min1, max1) {
  return Math.max(min0, max0) >= Math.min(min1, max1) &&
    Math.min(min0, max0) <= Math.max(min1, max1);
}

function getMouseCoords(e) {
  return {
    x: e.clientX,
    y: e.clientY
  };
}

function getPositionDiff(from, to) {
  return {
    x: to.x - from.x,
    y: to.y - from.y
  }
}

function copyStyles(fromElement, toElement, styles) {
  styles.forEach(style => {
    const value = getComputedStyle(fromElement).getPropertyValue(style);
    const attr  = fromElement.getAttribute('style');
    if (attr !== null) {
      toElement.dataset.styleToken = attr;
    }
    toElement.style.setProperty(style, value);
  });
}

function restoreStyle(element) {
  element.removeAttribute('style');
  if ('styleToken' in element.dataset) {
    const style = element.dataset.styleToken;
    element.setAttribute('style', style);
    element.removeAttribute('data-style-token');
  }
}
