import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="gantts--show"
export default class extends Controller {
  static outlets = ['gantts--table']

  draw(e) {
    this.ganttsTableOutlet.draw(e)
  }

  apply(e) {
    e.preventDefault();

    this.element.requestSubmit();
  }

  saveObject(e) {
    e.preventDefault();

    this.element.setAttribute('action', e.params.path);
    this.element.requestSubmit();
  }
}
