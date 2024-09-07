import { Controller } from "@hotwired/stimulus"
import { switchClass } from "dom"

// Connects to data-controller="row-group"
export default class extends Controller {

  toggle(e) {
    const target = e.currentTarget;

    target.classList.toggle('icon-expanded');
    target.classList.toggle('icon-collapsed');

    this.element.classList.toggle('open');
    const toggleDisplay = value => value === 'none' ? '' : 'none'

    let n = this.element.nextElementSibling;
    while (n !== null && !n.classList.contains('group')) {
      n.style.display = toggleDisplay(n.style.display);

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
        } else {
          el.style.display = open ? 'none' : '';
        }
      }
    }
  }
}
