import { Controller } from "@hotwired/stimulus"
import { post } from "@rails/request.js"

// Connects to data-controller="my-page-block"
export default class extends Controller {
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
  start(e) {
    this.element.classList.add('dragging')
  }

  end(e) {
    this.element.classList.remove('dragging')
  }
}
