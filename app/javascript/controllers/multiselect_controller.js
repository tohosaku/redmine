import { Controller } from "@hotwired/stimulus"
import { updateSVGIcon, toggleClass } from 'helper'

// Connects to data-controller="multiselect"
export default class extends Controller {
  static targets = ['toggle', 'select']

  toggleTargetConnected(element) {
    if (element.matches(':not(.icon-toggle-minus):not(.icon-toggle-plus)')) {
      const multiple = this.selectTarget.querySelector('option[selected=selected]');
      const svg  = element.querySelector('svg')
      const icon = multiple !== null ? 'toggle-minus' : 'toggle-plus';
      updateSVGIcon(svg, icon);
      element.classList.add(`icon-${icon}`);
    }
  }

  toggle(e) {
    const element = e.currentTarget;
    this.toggleSize(this.selectTarget);
    toggleClass(element, 'icon-toggle-plus', 'icon-toggle-minus');
    const svg  = element.querySelector('svg')
    const icon = element.classList.contains('icon-toggle-plus') ? 'toggle-plus' : 'toggle-minus'
    updateSVGIcon(svg, icon);
  }

  toggleSize(element) {
    const isWorkflow = element.closest('.controller-workflows');
    if (element.classList.contains('multiple')) {
      element.classList.remove('multiple');
      if (isWorkflow) {
        const option = element.querySelector("option[value=all]");
        if (option) {
          option.style.display = '';
        }
      }
      element.setAttribute('size', 1);
    } else {
      element.setAttribute('multiple', 'multiple')
      if (isWorkflow) {
        const option = element.querySelector("option[value=all]");
        if (option) {
          option.selected = false;
          option.style.display = 'none';
        }
      }
      const size = element.children.length > 10 ? 10 : 4;
      element.setAttribute('size', size);
    }
  }
}
