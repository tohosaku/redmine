/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

import { Controller } from "@hotwired/stimulus"
import { Tooltip } from 'tooltip'

// Connects to data-controller="issue--tooltip"
export default class extends Controller {
  show(e) {
    const tooltip = new Tooltip({
      delay: 0,
      selector: '.tooltip',
      createHook: (element) => {
        element.tooltipElement = element.querySelector('.tip');
      },
      positionHook: (element, tooltip) => {
        const trect = tooltip.getBoundingClientRect();
        const rect  = element.getBoundingClientRect();
        const gap = Math.min(12, rect.height / 2)
        return {
          top: rect.top + gap,
          left: rect.left + gap,
          width: trect.width,
          height: trect.height
        }
      }
    });
    tooltip.show(e)
  }
}
