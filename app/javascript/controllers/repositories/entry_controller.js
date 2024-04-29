import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'
import { switchClass } from 'helper'

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

function collapseScmEntry(id) {
  document.querySelectorAll(`.${id}`).forEach(elm => {
    if (elm.classList.contains('open')) {
      collapseScmEntry(elm.getAttribute('id'));
    }
    elm.style.display = 'none';
  })
  document.getElementById(id).classList.remove('open');
}

function expandScmEntry(id) {
  document.querySelectorAll(`.${id}`).forEach(elm => {
    elm.style.display = '';
    if (elm.classList.contains('loaded') && elm.classList.contains('collapsed')){
      expandScmEntry(elm.getAttribute('id'));
    }
  })
  document.getElementById(id).classList.add('open');
}
