import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="gantts--show"
export default class extends Controller {
  static targets = ['options']
  static outlets = ['gantts--table']

  ganttsTableOutletConnected(outlet, element) {
    outlet.options = this.options;
    outlet.prepare();
  }

  draw(e) {
    this.ganttsTableOutlet.options = this.options;
    this.ganttsTableOutlet.draw(e)
  }

  get options() {
    const _options = {}
    this.optionsTargets.forEach(elm => {
      _options[elm.getAttribute('id')] = elm.checked;
    })
    return _options
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
