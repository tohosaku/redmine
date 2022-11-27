import { Controller } from "@hotwired/stimulus"

const sortableDragging = 'draggable__drag'

// Connects to data-controller="sortable"
export default class extends Controller {
  static targets = ['area', 'item']

  connect() {
    this.draggingInside  = new DraggingInside(this)
    this.draggingOutside = new DraggingOutside(this)
    this.default         = new Default(this)
    this.setState(this.default)
  }

  start(e) {
    this.state.start(e)
  }

  move(e) {
    this.state.move(e)
  }

  end(e) {
    this.state.end(e)
  }

  noop(e) {
    e.preDefault()
  }

  setState(state) {
    this.state = state
  }
}

class State {
  constructor(context) {
    this.context = context;
  }

  start(e) {}

  move(e) {}

  end(e) {}
}

class Dragging extends State {
  end(e) {
    this.unselect(e)
  }

  unselect(e) {
    if (this.context.dragElement == null) return;

    this.setElement(this.context.placeholder, this.context.dragElement)

    this.context.dispatch('sorted', { detail: this.context.dragElement })
    this.context.dragElement = null;
    this.context.currentArea = null;

    this.context.setState(this.context.default)
  }

  setElement(current, element) {
    current.insertAdjacentElement('beforebegin', element);
    const index = current.dataset.sortedIndex
    current.remove();

    element.setAttribute(`data-${this.context.identifier}-target`, 'item')
    element.classList.remove(sortableDragging)
    element.removeAttribute('style')
    element.dataset.sortedIndex = index;
  }

  findArea(e) {
    const below = getElementBehind(this.context.dragElement, {x: e.clientX, y: e.clientY})
    const area  = this.context.areaTargets.find(e => e.contains(below))
    return area
  }
}

class DraggingInside extends Dragging {

  move(e) {
    const area = this.findArea(e)
    if (typeof area !== 'undefined') {
      this.moveInArea(e);
    } else {
      this.exitFromArea();
    }
  }

  moveInArea(e) {
    const coords   = getMouseCoords(e);
    const position = getPositionDiff(this.context.startCoords, coords);
    const items    = this.context.itemTargets.filter(elem => this.context.currentArea.contains(elem))
    this.moveRow(items, position);
  }

  exitFromArea() {
    this.context.currentArea.classList.remove('current-area')
    this.context.currentArea = null;
    this.context.setState(this.context.draggingOutside)
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
          swapRow(this.context.placeholder, currIndex, rowElem, i);
        }
      }
    })
  }
}

class DraggingOutside extends Dragging {

  move(e) {
    const area  = this.findArea(e)
    if (typeof area !== 'undefined') {
      this.enterToArea(area, {x: e.clientX, y: e.clientY});
    }
  }

  enterToArea(area, point) {

    if (!area.contains(this.context.placeholder)) {
      const items = this.context.itemTargets.filter(item => area.contains(item));

      // get nearest element
      const item  = items.reduce((i1, i2) => {
        const p1 = i1.getBoundingClientRect();
        const p2 = i2.getBoundingClientRect();
        return distance(p1, point) < distance(p2, point) ? i1 : i2
      })
      this.movePlaceholder(item)
    }

    this.context.currentArea = area;
    this.context.currentArea.classList.add('current-area')
    this.context.setState(this.context.draggingInside)
  }

  movePlaceholder(item) {
    if (typeof item === 'undefined') return;

    const dRect = this.context.dragElement.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    const pos   = (dRect.y < (iRect.y + iRect.height / 2)) ? 'beforebegin' :'afterend'
    const ph    = this.context.dragElement.cloneNode(true);
    item.insertAdjacentElement(pos, ph);
    ph.setAttribute(`data-${this.context.identifier}-target`, 'item')
    ph.setAttribute('style', undefined)
    ph.classList.add('is-dragging');

    this.context.placeholder.remove();
    this.context.placeholder = ph;
  }
}

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

class Default extends State {

  start(e) {
    this.select(e)
  }

  select(e) {
    if (e.button != 0) return true;

    const handle = e.target.closest('.sort-handle')
    if (handle === null) return;

    const target = this.context.itemTargets.find(item => item.contains(e.target))
    if (target) {
      this.context.currentArea = this.context.areaTargets.find(a => a.contains(target))
      this.context.currentArea.classList.add('current-area')
      this.context.placeholder = target;
      this.context.dragElement = this.addDraggableElement(target);
      this.context.placeholder.classList.add('is-dragging');
      this.context.placeholder.style.visibility = 'hidden';
      this.context.dragElement.setPointerCapture(e.pointerId);

      this.context.startCoords = getMouseCoords(e);
      this.context.setState(this.context.draggingInside)
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

    const ePos = this.context.element.getBoundingClientRect();
    const tPos = target.getBoundingClientRect();

    draggable.style.position = "absolute";
    draggable.style.top  = `${tPos.y - ePos.y - 3}px`
    draggable.style.left = `${tPos.x - ePos.x - 3}px`

    this.context.element.append(draggable);

    this.context.element.dispatchEvent(new PointerEvent('pointermove',
      { view: window, cancelable: true, bubbles: true }
    ));

    return draggable;
  }
}

function getElementBehind(element, {x, y}) {
  element.hidden = true
  const below = document.elementFromPoint(x, y);
  element.hidden = false

  return below;
}

function swapRow(currRow, currIndex, row, index) {
  const row1 = currIndex > index ? currRow : row;
  const row2 = currIndex > index ? row : currRow;

  const index1 = row1.dataset.sortedIndex;
  const index2 = row2.dataset.sortedIndex;
  row1.dataset.sortedIndex = index2;
  row2.dataset.sortedIndex = index1;

  row2.insertAdjacentElement('beforebegin', row1);
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
    toElement.style.setProperty(style, value);
  });
}

