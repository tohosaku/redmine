import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'
import { switchClass } from 'dom'

// Connects to data-controller="repositories--entry"
export default class extends Controller {
  toggle(e) {
    if (this.element.classList.contains('open')) {
      collapseScmEntry(this.element.getAttribute('id'));
      switchClass(this.expander, 'icon-expanded', 'icon-collapsed');
      this.element.classList.add('collapsed');
      return false;
    } else if (this.element.classList.contains('loaded')) {
      expandScmEntry(this.element.getAttribute('id'));
      switchClass(this.expander, 'icon-collapsed', 'icon-expanded');
      this.element.classList.remove('collapsed');
      return false;
    }
    if (this.element.classList.contains('loading')) {
      return false;
    }
    this.element.classList.add('loading');

    get(e.params.url).then(res => {
      if (res.ok) {
        return res.html
      }
    }).then(html => {
      this.element.insertAdjacentElement("afterend", html);
      this.element.classList.add('open');
      this.element.classList.add('loaded');
      this.element.classList.remove('loading');
      switchClass(this.expander, 'icon-collapsed', 'icon-expanded');
    })
    return true;
  }

  get expander() {
    return this.element.querySelectorAll('.expander')
  }
}
