import { Controller } from "@hotwired/stimulus"
import { toggleClass, switchClass, toggleExpandCollapseIcon } from 'helper'

// Connects to data-controller="row-group"
export default class extends Controller {
  toggle(e) {
    const target = e.currentTarget;

    toggleClass(target, 'icon-expanded', 'icon-collapsed');
    this.element.classList.toggle('open');

    let n = this.element.nextElementSibling;
    while (n !== null && !n.classList.contains('group')) {
      toggleDisplay(n)

      n = n.nextElementSibling;
      if (n !== null && !n.matches('tr')) {
        n = null;
      }
    }
  }

  toggleAll(e) {
    e.preventDefault();

    const tr = e.currentTarget.closest('tr');
    const open = tr.classList.contains('open')

    const tbody = e.currentTarget.closest('tbody');
    for(const el of tbody.children) {
      if (el.matches('tr')) {
        if (el.classList.contains('group')) {
          el.classList.toggle('open', !open);
          const expander = el.querySelector('.expander');
          switchClass(expander, 'icon-expanded', 'icon-collapsed', !open)
          toggleExpandCollapseIcon(expander)
        } else {
          toggleDisplay(el)
        }
      }
    }
  }
}

function toggleDisplay(element) {
  const display = element.style.display
  element.style.display = display === 'none' ? '' : 'none'
}
