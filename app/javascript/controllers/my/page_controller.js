import { Controller } from "@hotwired/stimulus"
import { State, Dragging, Releasing } from "controllers/sortable_controller"

// Connects to data-controller="my--page"
export default class extends Controller {
  static targets = ['area']

  connect() {
    this.draggingInside  = new MyDraggingInside(this)
    this.draggingOutside = new MyDraggingOutside(this)
    this.releasing       = new MyReleasing(this)

    this.currentArea     = null
    this.setState(this.releasing)
  }

  start(e) {
    this.element.classList.add('dragging')
    this.state.start(e)
  }

  move(e) {
    if (typeof this.state !== 'undefined') {
      this.state.move(e)
    }
  }

  end(e) {
    this.element.classList.remove('dragging')
    this.state.end(e)
  }

  noop(e) {
    e.preventDefault()
  }

  setState(state) {
    this.state = state
  }

  setCurrentArea(area) {
    if (area == null) {
      this.currentArea.removeAttribute('style')
      this.currentArea = null
    } else {
      if (this.currentArea !== null) {
        this.currentArea.removeAttribute('style')
      }
      area.setAttribute('style', 'border: 3px blue solid')
      this.currentArea = area
    }
  }

  areaTargetConnected(element) {
    this.replaceSortable(element.sortable_controller)
  }

  prepare(e) {
    this.replaceSortable(e.currentTarget.sortable_controller)
  }

  replaceSortable(controller) {
    if (typeof controller !== 'undefined') {
      controller.releasing = new SortableReleasing(controller)
      controller.dragging  = new SortableDragging(controller)
      controller.setState(controller.releasing)
    }
  }
}

class SortableReleasing extends Releasing {
  setToDragging(from, point) {
    const placeholder = from.placeholder
    const dragElement = from.dragElement

    const func = this.getAddMethod(dragElement, point)
    func(placeholder)
    this.context.element.append(dragElement)

    this.context.dragElement = dragElement
    this.context.placeholder = placeholder
    this.context.setState(this.context.dragging)
    this.context.startCoords = from.startCoords
  }

  getAddMethod(dragElement, point) {
    const items = this.context.itemTargets;

    if (items.length > 0) {
      // get nearest element
      const item  = items.reduce((i1, i2) => {
        const p1 = i1.getBoundingClientRect();
        const p2 = i2.getBoundingClientRect();
        return this.distance(p1, point) < this.distance(p2, point) ? i1 : i2
      })
      const pos = this.getPosition(dragElement, item)
      return (placeholder) => item.insertAdjacentElement(pos, placeholder)
    } else {
      return (placeholder) => this.context.element.append(placeholder)
    }
  }

  distance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
  }

  getPosition(dragElement, item) {
    const dRect = dragElement.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    return (dRect.y < (iRect.y + iRect.height / 2)) ? 'beforebegin' :'afterend'
  }

  get name() {
    return 'sortable releasing'
  }
}

class SortableDragging extends Dragging {
  setToReleasing() {
    this.context.dragElement = null
    this.context.placeholder = null
    this.context.setState(this.context.releasing)
  }

  get name() {
    return 'sortable dragging'
  }
}

class MyDragging extends State {
  findArea(e) {
    const below = this.getElementBehind(this.sortable.dragElement, {x: e.clientX, y: e.clientY})
    const area  = this.context.areaTargets.find(e => e.contains(below))
    return area
  }

  getElementBehind(element, {x, y}) {
    element.hidden = true
    const below = document.elementFromPoint(x, y);
    element.hidden = false

    return below;
  }

  enterToArea(area, point) {
    if (!area.contains(this.sortable.dragElement)) {
      area.sortable_controller.state.setToDragging(this.sortable, point)
      this.sortable.state.setToReleasing()
    }
    this.context.setCurrentArea(area)
    this.context.setState(this.context.draggingInside)
  }

  get sortable() {
    return this.context.currentArea.sortable_controller;
  }
}

class MyDraggingInside extends MyDragging {
  move(e) {
    const area = this.findArea(e)
    if (typeof area !== 'undefined') {
      if (this.context.currentArea === area) {
        this.moveInArea(e);
      } else {
        this.enterToArea(area, {x: e.clientX, y: e.clientY});
      }
    } else {
      this.exitFromArea();
    }
  }

  end(e) {
    this.sortable.end(e)
    this.context.currentArea = null;
    this.context.setState(this.context.releasing)
  }

  moveInArea(e) {
    this.sortable.move(e)
  }

  exitFromArea() {
    this.context.setState(this.context.draggingOutside)
  }

  get name() {
    return "dragging inside"
  }
}

class MyDraggingOutside extends MyDragging {

  move(e) {
    const area = this.findArea(e)
    if (typeof area !== 'undefined') {
      this.enterToArea(area, {x: e.clientX, y: e.clientY});
    }
  }

  get name() {
    return "dragging outside"
  }
}

class MyReleasing extends State {

  start(e) {
    this.context.setCurrentArea(e.target)
    this.context.setState(this.context.draggingInside)
  }

  get name() {
    return "releasing"
  }
}

/*
  static values = {
    url: String
  }

  connect() {
    const $element = $(this.element)
    $element.sortable({
      connectWith: '.block-receiver',
      tolerance: 'pointer',
      handle: '.sort-handle',
      start:  (event, ui) => $element.parent().addClass('dragging'),
      stop:   (event, ui) => $element.parent().removeClass('dragging'),
      update: (event, ui) => {
        // trigger the call on the list that receives the block only
        if ($element.find(ui.item).length > 0) {
          post(this.urlValue, {
            body: {
              'group': $element.attr('id').replace(/^list-/, ''),
              'blocks': $.map($element.children(), el => $(el).attr('id').replace(/^block-/, ''))
            },
            responseKind: 'turbo-stream'
          });
        }
      }
    });
  }
*/

