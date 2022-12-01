import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'

// Connects to data-controller="imports--run"
export default class extends Controller {

  static values = { max: Number, runpath: String }
  static targets = ['progress', 'progressbar', 'label']

  connect() {
    this.element.classList.add('ajax-loading');

    // Currently it is not possible to get file upload progress for fetch API.
    // $('#import-progress').progressbar({value: 0, max: this.maxValue});

    post(this.runpathValue, {
      responseKind: 'turbo-stream'
    });
  }

  progressTargetConnected(element) {
    // $(this.pregressbarTarget).progressbar({value: element.dataset.current });
    this.labelTarget.textContent = element.dataset.label;
    if (element.dataset.finished == 'true') {
      window.location.href = element.dataset.path;
    } else {
      post(element.dataset.runpath);
    }
    element.remove();
  }
}
