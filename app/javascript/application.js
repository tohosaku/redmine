import "controllers"
import "@hotwired/turbo-rails"
import {createTooltip} from 'tooltip';

// Turbo.session.drive = false;

document.addEventListener("turbo:load", () => {

  $('#content').on('change', 'input[data-disables], input[data-enables], input[data-shows]', toggleDisabledOnChange);
  toggleDisabledInit();

  $('#content').on('click', '.toggle-multiselect', function() {
    toggleMultiSelect($(this).siblings('select'));
    $(this).toggleClass('icon-toggle-plus icon-toggle-minus');
    updateSVGIcon($(this).find('svg')[0], $(this).hasClass('icon-toggle-plus') ? 'toggle-plus' : 'toggle-minus');
  });
  toggleMultiSelectIconInit();

  $('#auth_source_ldap_mode').change(function () {
    $('.ldaps_warning').toggle($(this).val() != 'ldaps_verify_peer');
  }).change();

  setupAjaxIndicator();
  hideOnLoad();
  defaultFocus();
  setupAttachmentDetail();
  setupTabs();
  setupFilePreviewNavigation();
  setupWikiTableSortableHeader();
  setupCopyButtonsToPreElements();
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
