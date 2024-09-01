// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "controllers"
import "@hotwired/turbo-rails"
import Tribute from '@redmine-ui/tribute'
import { get, post, put, patch, destroy } from '@rails/request.js'

// Turbo.session.drive = false;

export function ajaxGet(element, func) {
  const loading = 'ajax-loading';
  return (text, cb) => {
    element.classList.add(loading)

    get(func(text), { responseKind: 'json' })
      .then(res => {
        if (!res.ok) throw new Error();

        return res.json;
      })
      .then(json => cb(json))
      .finally(() => element.classList.remove(loading));
  }
}

export function observeAutocomplete(element, source, options) {

  if (element.classList.contains('autocomplete')) return;


  const func = (typeof source === 'string') ? () => source
                                            : source

  const tribute = new Tribute(Object.assign({
    autocompleteMode: true,
    menuShowMinLength: 2,
    noMatchTemplate: '',
    lookup: 'label',
    values: ajaxGet(element, func)
  }, options));
  tribute.attach(element);

  element.classList.add('autocomplete');
}

// This variable is used to focus selected project
let selected;
document.addEventListener('click', (e) => {

  const drdn = e.target.closest('.drdn');
  if (drdn !== null) {
    Array.from(document.querySelectorAll('.drdn')).forEach(el => el.classList.remove('expanded'))
  }

  const trigger = e.target.closest('.drdn-trigger');

  if (trigger !== null) {
    const drdn = e.target.closest('.drdn');
    if (drdn.classList.contains('expanded')) {
      drdn.classList.remove('expanded');
    } else {
      Array.from(document.querySelectorAll('.drdn')).forEach(el => el.classList.remove('expanded'))
      drdn.classList.add('expanded');
      selected = document.querySelector('.drdn-items a.selected'); // Store selected project
      if (selected !== null) {
        selected.focus(); // Calling focus to scroll to selected project
      }
      if (!isMobile()) {
        const autocomplete = drdn.querySelector('.autocomplete')
        if (autocomplete !== null) {
          autocomplete.focus();
        }
      }
      e.stopPropagation();
    }
  }
});

document.addEventListener("turbo:load", () => {

  $(".drdn .autocomplete").val('');

  // observeSearchfield('projects-quick-search', null, $('#projects-quick-search').data('automcomplete-url'));

  $(".drdn-content").keydown(function(event){
    var items = $(this).find(".drdn-items");

    // If a project is selected set focused to selected only once
    if (selected && selected.length > 0) {
      var focused = selected;
      selected = undefined;
    }
    else {
      var focused = items.find("a:focus");
    }
    switch (event.which) {
      case 40: //down
        if (focused.length > 0) {
          focused.nextAll("a").first().focus();;
        } else {
          items.find("a").first().focus();;
        }
        event.preventDefault();
        break;
      case 38: //up
        if (focused.length > 0) {
          var prev = focused.prevAll("a");
          if (prev.length > 0) {
            prev.first().focus();
          } else {
            $(this).find(".autocomplete").focus();
          }
          event.preventDefault();
        }
        break;
      case 35: //end
        if (focused.length > 0) {
          focused.nextAll("a").last().focus();
          event.preventDefault();
        }
        break;
      case 36: //home
        if (focused.length > 0) {
          focused.prevAll("a").last().focus();
          event.preventDefault();
        }
        break;
    }
  });

  $('#content').on('change', 'input[data-disables], input[data-enables], input[data-shows]', toggleDisabledOnChange);
  toggleDisabledInit();

  $('#content').on('click', '.toggle-multiselect', function() {
    toggleMultiSelect($(this).siblings('select'));
    $(this).toggleClass('icon-toggle-plus icon-toggle-minus');
  });
  toggleMultiSelectIconInit();

  $('#history .tabs').on('click', 'a', function(e){
    var tab = $(e.target).attr('id').replace('tab-','');
    document.cookie = 'history_last_tab=' + tab + '; SameSite=Lax'
  });

  $('#auth_source_ldap_mode').change(function () {
    $('.ldaps_warning').toggle($(this).val() != 'ldaps_verify_peer');
  }).change();

  setupAjaxIndicator();
  hideOnLoad();
  addFormObserversForDoubleSubmit();
  defaultFocus();
  setupAttachmentDetail();
  setupTabs();
  setupFilePreviewNavigation();
  setupWikiTableSortableHeader();

});

document.addEventListener('keydown', (e) => {
  if (event.target.matches && event.target.matches('form textarea')) {
    // Submit the form with Ctrl + Enter or Command + Return
    const targetForm = $(e.target).closest('form');
    if(e.keyCode == 13 && ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey) && targetForm.length)) {
      // For ajax, use click() instead of submit() to prevent "Invalid form authenticity token" error
      if (targetForm.attr('data-remote') == 'true') {
        if (targetForm.find('input[type=submit]').length === 0) { return false; }
        targetForm.find('textarea').blur().removeData('changed');
        targetForm.find('input[type=submit]').first().click();
      } else {
        targetForm.find('textarea').blur().removeData('changed');
        targetForm.submit();
      }
    }
  }
});
