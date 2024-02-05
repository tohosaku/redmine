import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

// Connects to data-controller="queries--filters"
export default class extends Controller {
  connect() {
    window.filterJson = this.getJson('filter-json')
    window.operatorLabels = this.getJson('operator-labels')
    window.operatorByType = this.getJson('operator-by-type')
    window.availableFilters = this.getJson('available-filters')
    window.labelDayPlural = this.getJson('label-day-plural')

    window.filtersUrl = this.getJson('filters-url')
    initFilters();
    filterJson.forEach(obj => {
      addFilter(obj[0], obj[1], obj[2])
    });
  }

  getJson(json_id) {
    const str = document.getElementById(json_id).textContent;
    return JSON.parse(str);
  }
}

function initFilters() {
  $('#add_filter_select').change(function() {
    addFilter($(this).val(), '', []);
  });
  $('#filters-table .field input[type=checkbox]').each(function() {
    toggleFilter($(this).val());
  });
  $('#filters-table').on('click', '.field input[type=checkbox]', function() {
    toggleFilter($(this).val());
  });
  $('#filters-table').on('keypress', 'input[type=text]', function(e) {
    if (e.keyCode == 13) $(this).closest('form').submit();
  });
}

function addFilter(field, operator, values) {
  const fieldId = field.replace('.', '_');
  const tr = $('#tr_'+fieldId);

  const filterOptions = availableFilters[field];
  if (!filterOptions) return;

  if (filterOptions['remote'] && filterOptions['values'] == null) {
    get(filtersUrl, {
      query: { name: field },
      responseKind: 'json'
    }).then(res => {
      if (res.ok) {
        filterOptions['values'] = res.json;
        addFilter(field, operator, values) ;
      }
    });
    return;
  }

  if (tr.length > 0) {
    tr.show();
  } else {
    buildFilterRow(field, operator, values);
  }
  $('#cb_'+fieldId).prop('checked', true);
  toggleFilter(field);
  toggleMultiSelectIconInit();
  $('#add_filter_select').val('').find('option').each(function() {
    if ($(this).attr('value') == field) {
      $(this).attr('disabled', true);
    }
  });
}

function buildFilterRow(field, operator, values) {
  var fieldId = field.replace('.', '_');
  var filterTable = $("#filters-table");
  var filterOptions = availableFilters[field];
  if (!filterOptions) return;
  var operators = operatorByType[filterOptions['type']];
  var filterValues = filterOptions['values'];
  var select;

  var tr = $('<div class="filter">').attr('id', 'tr_'+fieldId).html(
    '<div class="field"><input checked="checked" id="cb_'+fieldId+'" name="f[]" value="'+field+'" type="checkbox"><label for="cb_'+fieldId+'"> '+filterOptions['name']+'</label></div>' +
    '<div class="operator"><select id="operators_'+fieldId+'" name="op['+field+']"></select></div>' +
    '<div class="values"></div>'
  );
  filterTable.append(tr);

  select = tr.find('.operator select');
  operators.forEach(function(op) {
    var option = $('<option>').val(op).text(operatorLabels[op]);
    if (op == operator) { option.prop('selected', true); }
    select.append(option);
  });
  select.change(function(){ toggleOperator(field); });

  switch (filterOptions['type']) {
  case "list":
  case "list_with_history":
  case "list_optional":
  case "list_optional_with_history":
  case "list_status":
  case "list_subprojects":
    tr.find('.values').append(
      '<span style="display:none;"><select class="value" id="values_'+fieldId+'_1" name="v['+field+'][]"></select>' +
      ' <span class="toggle-multiselect icon-only '+(values.length > 1 ? 'icon-toggle-minus' : 'icon-toggle-plus')+'">&nbsp;</span></span>'
    );
    select = tr.find('.values select');
    if (values.length > 1) { select.attr('multiple', true); }
    filterValues.forEach(function(filterValue) {
      var option = $('<option>');
      if ($.isArray(filterValue)) {
        option.val(filterValue[1]).text(filterValue[0]);
        if ($.inArray(filterValue[1], values) > -1) {option.prop('selected', true);}
        if (filterValue.length == 3) {
          var optgroup = select.find('optgroup').filter(function(){return $(this).attr('label') == filterValue[2]});
          if (!optgroup.length) {optgroup = $('<optgroup>').attr('label', filterValue[2]);}
          option = optgroup.append(option);
        }
      } else {
        option.val(filterValue).text(filterValue);
        if ($.inArray(filterValue, values) > -1) {option.prop('selected', true);}
      }
      select.append(option);
    });
    break;
  case "date":
  case "date_past":
    tr.find('.values').append(
      '<span style="display:none;"><input type="date" name="v['+field+'][]" id="values_'+fieldId+'_1" size="10" class="value date_value" data-controller="calendar" /></span>' +
      ' <span style="display:none;"><input type="date" name="v['+field+'][]" id="values_'+fieldId+'_2" size="10" class="value date_value" data-controller="calendar" /></span>' +
      ' <span style="display:none;"><input type="text" name="v['+field+'][]" id="values_'+fieldId+'" size="3" class="value" /> '+labelDayPlural+'</span>'
    );
    $('#values_'+fieldId).val(values[0]);
    break;
  case "string":
  case "text":
  case "search":
    tr.find('.values').append(
      '<span style="display:none;"><input type="text" name="v['+field+'][]" id="values_'+fieldId+'" size="30" class="value" /></span>'
    );
    $('#values_'+fieldId).val(values[0]);
    break;
  case "relation":
    tr.find('.values').append(
      '<span style="display:none;"><input type="text" name="v['+field+'][]" id="values_'+fieldId+'" size="6" class="value" /></span>' +
      '<span style="display:none;"><select class="value" name="v['+field+'][]" id="values_'+fieldId+'_1"></select></span>'
    );
    $('#values_'+fieldId).val(values[0]);
    select = tr.find('.values select');
    filterValues.forEach(function(filterValue) {
      var option = $('<option>');
      option.val(filterValue[1]).text(filterValue[0]);
      if (values[0] == filterValue[1]) { option.prop('selected', true); }
      select.append(option);
    });
    break;
  case "integer":
  case "float":
  case "tree":
    tr.find('.values').append(
      '<span style="display:none;"><input type="text" name="v['+field+'][]" id="values_'+fieldId+'_1" size="14" class="value" /></span>' +
      ' <span style="display:none;"><input type="text" name="v['+field+'][]" id="values_'+fieldId+'_2" size="14" class="value" /></span>'
    );
    $('#values_'+fieldId+'_1').val(values[0]);
    $('#values_'+fieldId+'_2').val(values[1]);
    break;
  }
}

function toggleFilter(field) {
  var fieldId = field.replace('.', '_');
  if ($('#cb_' + fieldId).is(':checked')) {
    $("#operators_" + fieldId).show().removeAttr('disabled');
    toggleOperator(field);
  } else {
    $("#operators_" + fieldId).hide().attr('disabled', true);
    enableValues(field, []);
  }
}

function enableValues(field, indexes) {
  var fieldId = field.replace('.', '_');
  $('#tr_'+fieldId+' .values .value').each(function(index) {
    if ($.inArray(index, indexes) >= 0) {
      $(this).removeAttr('disabled');
      $(this).parents('span').first().show();
    } else {
      $(this).val('');
      $(this).attr('disabled', true);
      $(this).parents('span').first().hide();
    }

    if ($(this).hasClass('group')) {
      $(this).addClass('open');
    } else {
      $(this).show();
    }
  });
}

function toggleOperator(field) {
  var fieldId = field.replace('.', '_');
  var operator = $("#operators_" + fieldId);
  switch (operator.val()) {
    case "!*":
    case "*":
    case "nd":
    case "t":
    case "ld":
    case "nw":
    case "w":
    case "lw":
    case "l2w":
    case "nm":
    case "m":
    case "lm":
    case "y":
    case "o":
    case "c":
    case "*o":
    case "!o":
      enableValues(field, []);
      break;
    case "><":
      enableValues(field, [0,1]);
      break;
    case "<t+":
    case ">t+":
    case "><t+":
    case "t+":
    case ">t-":
    case "<t-":
    case "><t-":
    case "t-":
      enableValues(field, [2]);
      break;
    case "=p":
    case "=!p":
    case "!p":
      enableValues(field, [1]);
      break;
    default:
      enableValues(field, [0]);
      break;
  }
}
