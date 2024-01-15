import "controllers"
import "@hotwired/turbo-rails"
import {createTooltip} from 'tooltip';

Turbo.session.drive = false;

document.addEventListener('mouseover', (e) => {
  const tooltip = createTooltip()
  tooltip.show(e)
});
