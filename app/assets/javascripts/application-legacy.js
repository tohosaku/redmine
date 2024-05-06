/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

function checkAll(id, checked) {
  $('#'+id).find('input[type=checkbox]:enabled').prop('checked', checked);
}

function toggleCheckboxesBySelector(selector) {
  var all_checked = true;
  $(selector).each(function(index) {
    if (!$(this).is(':checked')) { all_checked = false; }
  });
  $(selector).prop('checked', !all_checked).trigger('change');
}

function showAndScrollTo(id, focus) {
  $('#'+id).show();
  if (focus !== null) {
    $('#'+focus).focus();
  }
  $('html, body').animate({scrollTop: $('#'+id).offset().top}, 100);
}

function toggleRowGroup(el) {
  var tr = $(el).parents('tr').first();
  var n = tr.next();
  tr.toggleClass('open');
  $(el).toggleClass('icon-expanded icon-collapsed');
  toggleExpendCollapseIcon(el)
  while (n.length && !n.hasClass('group')) {
    n.toggle();
    n = n.next('tr');
  }
}

function toggleExpendCollapseIcon(el) {
  const svg = el.getElementsByTagName('svg').item(0)

  if (svg === null) {
    return false;
  }

  if (el.classList.contains('icon-expanded')) {
    updateSVGIcon(svg, 'angle-down')
    svg.classList.remove('icon-rtl')
  } else {
    updateSVGIcon(svg, 'angle-right')
    svg.classList.add('icon-rtl')
  }
}

function updateSVGIcon(element, icon) {
  const iconElement = element.getElementsByTagName("use").item(0)

  if (iconElement === null) {
    return false;
  }

  const iconPath = iconElement.getAttribute('href');
  iconElement.setAttribute('href', iconPath.replace(/#.*$/g, "#icon--" + icon))
}

function createSVGIcon(icon) {
  const clonedIcon = document.querySelector('#icon-copy-source svg').cloneNode(true);
  updateSVGIcon(clonedIcon, icon);
  return clonedIcon
}

function collapseAllRowGroups(el) {
  var tbody = $(el).parents('tbody').first();
  tbody.children('tr').each(function(index) {
    if ($(this).hasClass('group')) {
      $(this).removeClass('open');
      var expander = $(this).find('.expander');
      expander.switchClass('icon-expanded', 'icon-collapsed');
      toggleExpendCollapseIcon(expander[0]);
    } else {
      $(this).hide();
    }
  });
}

function expandAllRowGroups(el) {
  var tbody = $(el).parents('tbody').first();
  tbody.children('tr').each(function(index) {
    if ($(this).hasClass('group')) {
      $(this).addClass('open');
      var expander = $(this).find('.expander');
      expander.switchClass('icon-collapsed', 'icon-expanded');
      toggleExpendCollapseIcon(expander[0]);
    } else {
      $(this).show();
    }
  });
}

function toggleAllRowGroups(el) {
  var tr = $(el).parents('tr').first();
  if (tr.hasClass('open')) {
    collapseAllRowGroups(el);
  } else {
    expandAllRowGroups(el);
  }
}

function toggleFieldset(el) {
  var fieldset = $(el).parents('fieldset').first();
  fieldset.toggleClass('collapsed');
  fieldset.children('legend').toggleClass('icon-expanded icon-collapsed');
  toggleExpendCollapseIcon(fieldset.children('legend')[0])
  fieldset.children('div').toggle();
}

function hideFieldset(el) {
  var fieldset = $(el).parents('fieldset').first();
  fieldset.toggleClass('collapsed');
  fieldset.children('div').hide();
}

// columns selection
function moveOptions(theSelFrom, theSelTo) {
  $(theSelFrom).find('option:selected').detach().prop("selected", false).appendTo($(theSelTo));
}

function moveOptionUp(theSel) {
  $(theSel).find('option:selected').each(function(){
    $(this).prev(':not(:selected)').detach().insertAfter($(this));
  });
}

function moveOptionTop(theSel) {
  $(theSel).find('option:selected').detach().prependTo($(theSel));
}

function moveOptionDown(theSel) {
  $($(theSel).find('option:selected').get().reverse()).each(function(){
    $(this).next(':not(:selected)').detach().insertBefore($(this));
  });
}

function moveOptionBottom(theSel) {
  $(theSel).find('option:selected').detach().appendTo($(theSel));
}

function toggleMultiSelect(el) {
  var isWorkflow = el.closest('.controller-workflows');
  if (el.attr('multiple')) {
    el.removeAttr('multiple');
    if (isWorkflow) { el.find("option[value=all]").show(); }
    el.attr('size', 1);
  } else {
    el.attr('multiple', true);
    if (isWorkflow) { el.find("option[value=all]").attr("selected", false).hide(); }
    if (el.children().length > 10)
      el.attr('size', 10);
    else
      el.attr('size', 4);
  }
}

function showTab(name, url) {
  $('#tab-content-' + name).parent().find('.tab-content').hide();
  $('#tab-content-' + name).show();
  $('#tab-' + name).closest('.tabs').find('a').removeClass('selected');
  $('#tab-' + name).addClass('selected');

  replaceInHistory(url)

  return false;
}

function showIssueHistory(journal, url) {
  const tab_content = $('#tab-content-history');
  tab_content.parent().find('.tab-content').hide();
  tab_content.show();
  tab_content.parent().children('div.tabs').find('a').removeClass('selected');

  $('#tab-' + journal).addClass('selected');

  replaceInHistory(url)

  switch(journal) {
    case 'notes':
      tab_content.find('.journal').show();
      tab_content.find('.journal:not(.has-notes)').hide();
      tab_content.find('.journal .wiki').show();
      tab_content.find('.journal .journal-actions > *').show();

      // always show thumbnails in notes tab
      var thumbnails = tab_content.find('.journal .thumbnails');
      thumbnails.show();
      // show journals without notes, but with thumbnails
      thumbnails.parents('.journal').show();
      break;
    case 'properties':
      tab_content.find('.journal').show();
      tab_content.find('.journal:not(.has-details)').hide();
      tab_content.find('.journal .wiki').hide();
      tab_content.find('.journal .thumbnails').hide();
      tab_content.find('.journal .journal-actions > *').hide();
      // Show reaction button in properties tab
      tab_content.find('.journal .journal-actions .reaction-button-wrapper').show();
      break;
    default:
      tab_content.find('.journal').show();
      tab_content.find('.journal .wiki').show();
      tab_content.find('.journal .thumbnails').show();
      tab_content.find('.journal .journal-actions > *').show();
  }

  return false;
}

function getRemoteTab(name, remote_url, url, load_always) {
  load_always = load_always || false;
  var tab_content = $('#tab-content-' + name);

  tab_content.parent().find('.tab-content').hide();
  tab_content.parent().children('div.tabs').find('a').removeClass('selected');
  $('#tab-' + name).addClass('selected');

  replaceInHistory(url);

  if (tab_content.children().length == 0 && load_always == false) {
    $.ajax({
      url: remote_url,
      type: 'get',
      success: function(data){
        tab_content.html(data)
      }
    });
  }

  tab_content.show();
  return false;
}

//replaces current URL with the "href" attribute of the current link
//(only triggered if supported by browser)
function replaceInHistory(url) {
  if ("replaceState" in window.history && url !== undefined) {
    window.history.replaceState(null, document.title, url);
  }
}

function moveTabRight(el) {
  var lis = $(el).parents('div.tabs').first().find('ul').children();
  var bw = $(el).parents('div.tabs-buttons').outerWidth(true);
  var tabsWidth = 0;
  var i = 0;
  lis.each(function() {
    if ($(this).is(':visible')) {
      tabsWidth += $(this).outerWidth(true);
    }
  });
  if (tabsWidth < $(el).parents('div.tabs').first().width() - bw) { return; }
  $(el).siblings('.tab-left').removeClass('disabled');
  while (i<lis.length && !lis.eq(i).is(':visible')) { i++; }
  var w = lis.eq(i).width();
  lis.eq(i).hide();
  if (tabsWidth - w < $(el).parents('div.tabs').first().width() - bw) {
    $(el).addClass('disabled');
  }
}

function moveTabLeft(el) {
  var lis = $(el).parents('div.tabs').first().find('ul').children();
  var i = 0;
  while (i < lis.length && !lis.eq(i).is(':visible')) { i++; }
  if (i > 0) {
    lis.eq(i-1).show();
    $(el).siblings('.tab-right').removeClass('disabled');
  }
  if (i <= 1) {
    $(el).addClass('disabled');
  }
}

function displayTabsButtons() {
  var lis;
  var tabsWidth;
  var el;
  var numHidden;
  $('div.tabs').each(function() {
    el = $(this);
    lis = el.find('ul').children();
    tabsWidth = 0;
    numHidden = 0;
    lis.each(function(){
      if ($(this).is(':visible')) {
        tabsWidth += $(this).outerWidth(true);
      } else {
        numHidden++;
      }
    });
    var bw = $(el).find('div.tabs-buttons').outerWidth(true);
    if ((tabsWidth < el.width() - bw) && (lis.length === 0 || lis.first().is(':visible'))) {
      el.find('div.tabs-buttons').hide();
    } else {
      el.find('div.tabs-buttons').show().children('button.tab-left').toggleClass('disabled', numHidden == 0);
    }
  });
}

function setPredecessorFieldsVisibility() {
  var relationType = $('#relation_relation_type');
  if (relationType.val() == "precedes" || relationType.val() == "follows") {
    $('#predecessor_fields').show();
  } else {
    $('#predecessor_fields').hide();
  }
}

function showModal(id, width, title) {
  var el = $('#'+id).first();
  if (el.length === 0 || el.is(':visible')) {return;}
  if (!title) title = el.find('h3.title').text();
  // moves existing modals behind the transparent background
  $(".modal").css('zIndex',99);
  el.dialog({
    width: width,
    modal: true,
    resizable: false,
    dialogClass: 'modal',
    title: title
  }).on('dialogclose', function(){
    $(".modal").css('zIndex',101);
  });
  el.find("input[type=text], input[type=submit]").first().focus();
}

function hideModal(el) {
  var modal;
  if (el) {
    modal = $(el).parents('.ui-dialog-content');
  } else {
    modal = $('#ajax-modal');
  }
  modal.dialog("close");
}

function collapseScmEntry(id) {
  $('.'+id).each(function() {
    if ($(this).hasClass('open')) {
      collapseScmEntry($(this).attr('id'));
    }
    $(this).hide();
  });
  $('#'+id).removeClass('open');
}

function expandScmEntry(id) {
  $('.'+id).each(function() {
    $(this).show();
    if ($(this).hasClass('loaded') && !$(this).hasClass('collapsed')) {
      expandScmEntry($(this).attr('id'));
    }
  });
  $('#'+id).addClass('open');
}

function scmEntryClick(id, url) {
    var el = $('#'+id);
    var expander = el.find('.expander');
    var folder = el.find('.icon-folder');

    if (el.hasClass('open')) {
        collapseScmEntry(id);
        el.find('.expander').switchClass('icon-expanded', 'icon-collapsed');
        el.addClass('collapsed');
        updateSVGIcon(folder[0], 'folder')
        toggleExpendCollapseIcon(expander[0]);

        return false;
    } else if (el.hasClass('loaded')) {
        expandScmEntry(id);
        el.find('.expander').switchClass('icon-collapsed', 'icon-expanded');
        el.removeClass('collapsed');
        updateSVGIcon(folder[0], 'folder-open')
        toggleExpendCollapseIcon(expander[0]);

        return false;
    }
    if (el.hasClass('loading')) {
        return false;
    }
    el.addClass('loading');
    $.ajax({
      url: url,
      success: function(data) {
        el.after(data);
        el.addClass('open').addClass('loaded').removeClass('loading');
        el.find('.expander').switchClass('icon-collapsed', 'icon-expanded');
        updateSVGIcon(folder[0], 'folder-open')
        toggleExpendCollapseIcon(expander[0]);
      }
    });
    return true;
}

function randomKey(size) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var key = '';
  for (var i = 0; i < size; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).catch(() => {
      return fallbackClipboardCopy(text);
    });
  } else {
    return fallbackClipboardCopy(text);
  }
}

function fallbackClipboardCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  return Promise.resolve();
}

function copyDataClipboardTextToClipboard(target) {
  copyToClipboard(target.getAttribute('data-clipboard-text'));

  if ($(target).closest('.drdn.expanded').length) {
    $(target).closest('.drdn.expanded').removeClass("expanded");
  }
  return false;
}

function setupCopyButtonsToPreElements() {
  document.querySelectorAll('.wiki pre:not(.pre-wrapper pre)').forEach((pre) => {
    // Wrap the <pre> element with a container and add a copy button
    const wrapper = document.createElement("div");
    wrapper.classList.add("pre-wrapper");

    const copyButton = document.createElement("a");
    copyButton.title = rm.I18n.buttonCopy;
    copyButton.classList.add("copy-pre-content-link", "icon-only");
    copyButton.append(createSVGIcon("copy-pre-content"));

    wrapper.appendChild(copyButton);
    wrapper.append(pre.cloneNode(true));
    pre.replaceWith(wrapper);

    // Copy the contents of the pre tag when copyButton is clicked
    copyButton.addEventListener("click", (event) => {
      event.preventDefault();
      let textToCopy = (pre.querySelector("code") || pre).textContent.replace(/\n$/, '');
      if (pre.querySelector("code.syntaxhl")) { textToCopy = textToCopy.replace(/ $/, ''); } // Workaround for half-width space issue in Textile's highlighted code
      copyToClipboard(textToCopy).then(() => {
        updateSVGIcon(copyButton, "checked");
        setTimeout(() => updateSVGIcon(copyButton, "copy-pre-content"), 2000);
      });
    });
  });
}

function updateIssueFrom(url, el) {
  $('#all_attributes input, #all_attributes textarea, #all_attributes select').each(function(){
    $(this).data('valuebeforeupdate', $(this).val());
  });
  if (el) {
    $("#form_update_triggered_by").val($(el).attr('id'));
  }
  return $.ajax({
    url: url,
    type: 'post',
    data: $('#issue-form').serialize()
  });
}

function replaceIssueFormWith(html){
  var replacement = $(html);
  $('#all_attributes input, #all_attributes textarea, #all_attributes select').each(function(){
    var object_id = $(this).attr('id');
    if (object_id && $(this).data('valuebeforeupdate')!=$(this).val()) {
      replacement.find('#'+object_id).val($(this).val());
    }
  });
  $('#all_attributes').empty();
  $('#all_attributes').prepend(replacement);
}

function updateBulkEditFrom(url) {
  $.ajax({
    url: url,
    type: 'post',
    data: $('#bulk_edit_form').serialize()
  });
}

function observeAutocompleteField(fieldId, url, options) {
  $(document).ready(function() {
    $('#'+fieldId).autocomplete($.extend({
      source: url,
      minLength: 2,
      position: {collision: "flipfit"},
      search: function(){$('#'+fieldId).addClass('ajax-loading');},
      response: function(){$('#'+fieldId).removeClass('ajax-loading');}
    }, options));
    $('#'+fieldId).addClass('autocomplete');
  });
}

function multipleAutocompleteField(fieldId, url, options) {
  function split(val) {
    return val.split(/,\s*/);
  }

  function extractLast(term) {
    return split(term).pop();
  }

  $(document).ready(function () {
    $('#' + fieldId).autocomplete($.extend({
      source: function (request, response) {
        $.getJSON(url, {
          term: extractLast(request.term)
        }, response);
      },
      minLength: 2,
      position: {collision: "flipfit"},
      search: function () {
        $('#' + fieldId).addClass('ajax-loading');
      },
      response: function () {
        $('#' + fieldId).removeClass('ajax-loading');
      },
      select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join(", ");
        return false;
      }
    }, options));
    $('#' + fieldId).addClass('autocomplete');
  });
}

function observeSearchfield(fieldId, targetId, url) {
  $('#'+fieldId).each(function() {
    var $this = $(this);
    $this.addClass('autocomplete');
    $this.attr('data-value-was', $this.val());
    var check = function() {
      var val = $this.val();
      if ($this.attr('data-value-was') != val){
        $this.attr('data-value-was', val);
        $.ajax({
          url: url,
          type: 'get',
          data: {q: $this.val()},
          success: function(data){ if(targetId) $('#'+targetId).html(data); },
          beforeSend: function(){ $this.addClass('ajax-loading'); },
          complete: function(){ $this.removeClass('ajax-loading'); }
        });
      }
    };
    var reset = function() {
      if (timer) {
        clearInterval(timer);
        timer = setInterval(check, 300);
      }
    };
    var timer = setInterval(check, 300);
    $this.bind('keyup click mousemove', reset);
  });
}

function beforeShowDatePicker(input, inst) {
  var default_date = null;
  switch ($(input).attr("id")) {
    case "issue_start_date" :
      if ($("#issue_due_date").length > 0) {
        default_date = $("#issue_due_date").val();
      }
      break;
    case "issue_due_date" :
      if ($("#issue_start_date").length > 0) {
        var start_date = $("#issue_start_date").val();
        if (start_date != "") {
          start_date = new Date(Date.parse(start_date));
          if (start_date > new Date()) {
            default_date = $("#issue_start_date").val();
          }
        }
      }
      break;
  }
  $(input).datepickerFallback("option", "defaultDate", default_date);
}

var warnLeavingUnsavedMessage;
function warnLeavingUnsaved(message) {
  warnLeavingUnsavedMessage = message;
  $(document).on('submit', 'form', function(){
    $('textarea').removeData('changed');
  });
  $(document).on('change', 'textarea', function(){
    $(this).data('changed', 'changed');
  });
  window.onbeforeunload = function(){
    var warn = false;
    $('textarea').blur().each(function(){
      if ($(this).data('changed')) {
        warn = true;
      }
    });
    if (warn) {return warnLeavingUnsavedMessage;}
  };
}

function setupAjaxIndicator() {
  $(document).bind('ajaxSend', function(event, xhr, settings) {
    if ($('.ajax-loading').length === 0 && settings.contentType != 'application/octet-stream') {
      $('#ajax-indicator').show();
    }
  });
  $(document).bind('ajaxStop', function() {
    $('#ajax-indicator').hide();
  });
}

function setupTabs() {
  if($('.tabs').length > 0) {
    displayTabsButtons();
    $(window).resize(displayTabsButtons);
  }
}

function setupFilePreviewNavigation() {
  // only bind arrow keys when preview navigation is present
  const element = $('.pagination.filepreview').first();
  if (element) {

    const handleArrowKey = function(selector, e){
      const href = $(element).find(selector).attr('href');
      if (href) {
        window.location = href;
        e.preventDefault();
      }
    };

    $(document).keydown(function(e) {
      if(e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      switch(e.key) {
        case 'ArrowLeft':
          handleArrowKey('.previous a', e);
          break;

        case 'ArrowRight':
          handleArrowKey('.next a', e);
          break;
      }
    });
  }
}

function hideOnLoad() {
  $('.hol').hide();
}

function addFormObserversForDoubleSubmit() {
  $('form[method=post]').each(function() {
    if (!$(this).hasClass('multiple-submit')) {
      $(this).submit(function(form_submission) {
        if ($(form_submission.target).attr('data-submitted')) {
          form_submission.preventDefault();
        } else {
          $(form_submission.target).attr('data-submitted', true);
        }
      });
    }
  });
}

function defaultFocus(){
  if (($('#content :focus').length == 0) && (window.location.hash == '')) {
    $('#content input[type=text]:visible, #content textarea:visible').first().focus();
  }
}

function blockEventPropagation(event) {
  event.stopPropagation();
  event.preventDefault();
}

function toggleDisabledOnChange() {
  var checked = $(this).is(':checked');
  $($(this).data('disables')).attr('disabled', checked);
  $($(this).data('enables')).attr('disabled', !checked);
  $($(this).data('shows')).toggle(checked);
}
function toggleDisabledInit() {
  $('input[data-disables], input[data-enables], input[data-shows]').each(toggleDisabledOnChange);
}
function toggleMultiSelectIconInit() {
  $('.toggle-multiselect:not(.icon-toggle-minus):not(.icon-toggle-plus)').each(function(){
    let iconType;
    if ($(this).siblings('select').find('option:selected').length > 1) {
      iconType = 'toggle-minus';
    } else {
      iconType = 'toggle-plus';
    }

    $(this).addClass(`icon-${iconType}`);
    updateSVGIcon($(this).find('svg')[0], iconType);
  });
}

function toggleNewObjectDropdown() {
  var dropdown = $('#new-object + ul.menu-children');
  if(dropdown.hasClass('visible')){
    dropdown.removeClass('visible');
  }else{
    dropdown.addClass('visible');
  }
}

function keepAnchorOnSignIn(form){
  var hash = decodeURIComponent(self.document.location.hash);
  if (hash) {
    if (hash.indexOf("#") === -1) {
      hash = "#" + hash;
    }
    form.action = form.action + hash;
  }
  return true;
}

function setFilecontentContainerHeight() {
  var $filecontainer = $('.filecontent-container');
  var fileTypeSelectors = ['.image', 'video'];

  if($filecontainer.length > 0 && $filecontainer.find(fileTypeSelectors.join(',')).length === 1) {
    var containerOffsetTop = $filecontainer.offset().top;
    var containerMarginBottom = parseInt($filecontainer.css('marginBottom'));
    var paginationHeight = $filecontainer.next('.pagination').height();
    var diff = containerOffsetTop + containerMarginBottom + paginationHeight;

    $filecontainer.css('height', 'calc(100vh - ' + diff + 'px)')
  }
}

function setupAttachmentDetail() {
  setFilecontentContainerHeight();
  $(window).resize(setFilecontentContainerHeight);
}

function setupWikiTableSortableHeader() {
  if (typeof Tablesort === 'undefined') { return; }
  $('div.wiki table').each(function(i, table){
    if (table.rows.length < 3) return true;
    var tr = $(table.rows).first();
    if (tr.find("TH").length > 0) {
      tr.attr('data-sort-method', 'none');
      tr.find("TD").attr('data-sort-method', 'none');
      new Tablesort(table);
    }
  });
}
