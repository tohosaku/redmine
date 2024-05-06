// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "controllers"
import "@hotwired/turbo-rails"
import Tribute from '@redmine-ui/tribute'
import { get, post, put, patch, destroy } from '@rails/request.js'

// Turbo.session.drive = false;

Turbo.StreamActions.hide = function() {
  this.targetElements.forEach((e) => {
    e.style.display = 'none';
  });
}

Turbo.StreamActions.show = function() {
  this.targetElements.forEach((e) => {
    e.style.display = '';
  });
}

Turbo.StreamActions.focus = function() {
  this.targetElements.forEach((e) => {
    e.focus();
  });
}

Turbo.StreamActions.clear = function() {
  this.targetElements.forEach((e) => {
    e.value = '';
  });
}

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

document.addEventListener("turbo:load", () => {

  $(".drdn .autocomplete").val('');

  // This variable is used to focus selected project
  var selected;
  $(document).on('click', '.drdn-trigger', function(e){
    var drdn = $(this).closest(".drdn");
    if (drdn.hasClass("expanded")) {
      drdn.removeClass("expanded");
    } else {
      $(".drdn").removeClass("expanded");
      drdn.addClass("expanded");
      selected = $('.drdn-items a.selected'); // Store selected project
      selected.focus(); // Calling focus to scroll to selected project
      if (!isMobile()) {
        drdn.find(".autocomplete").focus();
      }
      e.stopPropagation();
    }
  });
  $(document).click(function(e){
    if ($(e.target).closest(".drdn").length < 1) {
      $(".drdn.expanded").removeClass("expanded");
    }
  });

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
