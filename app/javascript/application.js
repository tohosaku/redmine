import "controllers"
import "@hotwired/turbo-rails"
import {createTooltip} from 'tooltip';
import {metaContent,isVisible} from 'helper';

// Turbo.session.drive = false;

document.addEventListener("turbo:load", () => {
  setupAjaxIndicator();
  defaultFocus();
  // set default focus
  const element = document.querySelector('#content :focus')
  if ((element !== null) && (window.location.hash == '')) {
    const targets = document.querySelectorAll('#content input[type=text], #content textarea')
    Array.from(targets).find(e => isVisible(e)).focus()
  }
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

(() => {
  const message = metaContent('warn_on_leaving_unsaved')
  if (message !== null) {
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form')) {
        const textarea = Array.from(document.querySelectorAll('textarea'))
        textarea.forEach(elem => elem.removeAttribute('data-changed'))
      }
    })
    function warnLeavingUnsaved(e) {
      const textarea = Array.from(document.querySelectorAll('textarea'))
      textarea.forEach(elem => elem.blur())
      const warn = textarea.some(elem => (typeof elem.dataset.changed !== 'undefined'))
      if (warn) {
        e.preventDefault();
        e.returnValue = message;
      }
    }
    window.addEventListener('beforeunload', warnLeavingUnsaved)
  }
})()
