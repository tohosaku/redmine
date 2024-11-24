/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function createTooltip() {
  const tooltip = new Tooltip({
    selector: '[title]:not(.no-tooltip)',
    createHook: (element) => {
      const tooltip = document.createElement('span')
      tooltip.textContent = element.getAttribute('title');
      element.setAttribute('title', '');
      tooltip.classList.add('action-tooltip');
      element.insertAdjacentElement('afterbegin', tooltip);
      element.tooltipElement = tooltip;
    },
    positionHook: (element, tooltip) => {
      const trect = tooltip.getBoundingClientRect();
      const rect  = element.getBoundingClientRect();

      return {
        top: rect.top - trect.height - 5,
        left: rect.left + rect.width / 2 - trect.width / 2,
        width: trect.width,
        height: trect.height
      }
    }
  });
  return tooltip;
}

export class Tooltip {
  constructor(options) {
    this.options = Object.assign({
      delay: 400,
      selector: undefined,
    }, options)
    this.delayedShow = null;
    this.delayedHide = null;
  }

  show(e) {
    const target = e.target.closest(this.options.selector)
    if (target !== null) {

      if (target.tooltipElement === undefined) {
        this.options.createHook(target);
        target.addEventListener('mouseleave', (e) => this.hide(e));
      }

      this.delayedShow = setTimeout(() => {
        this.setPosition(target);
      }, this.options.delay);
    }
  }

  hide(e) {
    if (this.delayedShow !== null) {
      clearTimeout(this.delayedShow);
    }
    this.delayedHide = setTimeout(() => {
      const tooltip = e.target.tooltipElement;
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = 0;
    }, this.options.delay);
  }

  setPosition(target) {
    const tooltip = target.tooltipElement;
    const position = this.options.positionHook(target, tooltip);
    const cheight = document.documentElement.clientHeight;
    const cwidth = document.documentElement.clientWidth;

    if (position.top + position.height > cheight) {
      position.top = cheight - position.height;
    }

    if (position.left + position.width > cwidth) {
      position.left = cwidth - position.width;
    }

    if (position.top < 0) {
      position.top = 0;
    }

    if (position.left < 0) {
      position.left = 0;
    }

    tooltip.style.top = `${position.top}px`;
    tooltip.style.left = `${position.left}px`;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = 1;
  }
}
