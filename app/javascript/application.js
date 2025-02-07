import "controllers"
import "@hotwired/turbo-rails"
import {createTooltip} from 'tooltip';

// Turbo.session.drive = false;

document.addEventListener("turbo:load", () => {
  setupAjaxIndicator();
  defaultFocus();
});

document.addEventListener('turbo:submit-start', (e) => {
  if (e.target.matches('form[method=post]:not(.multiple-submit)')) {
    if (e.target.dataset.submitted) {
      e.preventDefault();
    } else {
      e.target.dataset.submitted = 'true'
    }
  }
})

document.addEventListener('mouseover', (e) => {
  const tooltip = createTooltip()
  tooltip.show(e)
});
