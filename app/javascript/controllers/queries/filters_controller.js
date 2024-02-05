import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'
import { jsonContent, updateSVGIcon, sanitizeHTML } from 'helper'

// Connects to data-controller="queries--filters"
export default class extends Controller {
  static targets = ['addFilter']

  connect() {
    window.filterJson       = jsonContent('filter-json')
    window.operatorLabels   = jsonContent('operator-labels')
    window.operatorByType   = jsonContent('operator-by-type')
    window.availableFilters = jsonContent('available-filters')
    window.labelDayPlural   = jsonContent('label-day-plural')

    window.filtersUrl       = jsonContent('filters-url')

    const checkboxes = document.querySelectorAll('#filters-table .field input[type=checkbox]');
    checkboxes.forEach(cb => toggleFilter(cb.value));

    filterJson.forEach(obj => {
      addFilter(obj[0], obj[1], obj[2])
    });
  }

  addFilter(e) {
    addFilter(e.currentTarget.value, '', []);
    this.addFilterTarget.value = '';
    this.addFilterTarget.querySelectorAll('option').forEach(opt => {
      if (opt.value === e.currentTarget.value) {
        opt.disabled = true;
      }
    })
  }

  toggle(e) {
    if (e.target.matches('.field input[type=checkbox]')) {
      toggleFilter(e.target.value);
    }
  }

  toggleOperator(e) {
    toggleOperator(e.params.field);
  }

  submit(e) {
    if (e.target.matches('input[type=text]') && e.keyCode == 13) {
      e.target.closest('form').submit();
    }
  }
}

function toggleMultiSelectIconInit() {
  const selector = '.toggle-multiselect:not(.icon-toggle-minus):not(.icon-toggle-plus)';
  const elements = Array.from(document.querySelectorAll(selector));

  elements.forEach(elem => {
    const select = Array.from(el.parentNode.children).filter((child) => child !== elem && elem.matches('select'));
    const selected = select.find(elem => elem.querySelector('option[selected=selected]'));

    const iconType = selected ? 'toggle-minus' : 'toggle-plus';
    elem.classList.add(`icon-${iconType}`);
    const svg = elem.querySelector('svg');
    updateSVGIcon(svg, iconType);
  })
}

function addFilter(field, operator, values) {
  const fieldId = field.replace('.', '_');
  const tr = document.getElementById(`tr_${fieldId}`);

  const filterOptions = availableFilters[field];
  if (!filterOptions) return;

  if (filterOptions['remote'] && filterOptions['values'] == null) {
    get(filtersUrl, {
      query: { name: field },
      responseKind: 'json'
    }).then(res => {
      if (res.ok) {
        return res.json;
      }
    }).then(data => {
      filterOptions['values'] = data;
      addFilter(field, operator, values);
    });
    return;
  }

  if (tr !== null) {
    tr.style.display = '';
  } else {
    buildFilterRow(field, operator, values);
  }
  const checkbox = document.getElementById(`cb_${fieldId}`);
  if (checkbox) {
    checkbox.checked = true;
  }
  toggleFilter(field);
  toggleMultiSelectIconInit();
}

function buildFilterRow(field, operator, values) {
  const fieldId = field.replace('.', '_');
  const filterTable = document.getElementById("filters-table");

  const filterOptions = availableFilters[field];
  if (!filterOptions) return;

  const operators = operatorByType[filterOptions['type']];
  const filterValues = filterOptions['values'];
  let select;

  const trId = `tr_${fieldId}`;
  const trStr = `<div class="filter" id="${trId}">
      <div class="field"><input checked="checked" id="cb_${fieldId}" name="f[]" value="${field}" type="checkbox"><label for="cb_${fieldId}"> ${sanitizeHTML(filterOptions['name'])}</label></div>
      <div class="operator"><select id="operators_${fieldId}" name="op[${field}]" data-action="change->queries--filters#toggleOperator" data-queries--filters-field-param="${field}"></select></div>
      <div class="values"></div>
    </div>`
  filterTable.insertAdjacentHTML('afterbegin', trStr)
  const tr = document.getElementById(trId);

  select = tr.querySelector('.operator select');
  if (select) {
    operators.forEach((op) => select.append(createOption(op, operatorLabels[op], op === operator)));
  }

  switch (filterOptions['type']) {
  case "list":
  case "list_with_history":
  case "list_optional":
  case "list_optional_with_history":
  case "list_status":
  case "list_subprojects":
    const iconType = values.length > 1 ? 'toggle-minus' : 'toggle-plus';
    const clonedIcon = document.querySelector('#icon-copy-source svg').cloneNode(true);
    updateSVGIcon(clonedIcon, iconType);

    const span = `<span style="display:none;"><select class="value" id="values_${fieldId}_1" name="v[${field}][]"></select>
        <span class="toggle-multiselect icon-only icon-${iconType}"></span></span>`

    tr.querySelector('.values').insertAdjacentHTML('beforeend', span);
    const iconholder = tr.querySelector(`span.icon-${iconType}`);
    iconholder.append(clonedIcon);
    select = tr.querySelector('.values select');

    if (values.length > 1) {
      select.setAttribute('multiple', 'multiple');
    }

    filterValues.forEach((filterValue) => {
      let option;
      if (Array.isArray(filterValue)) {
        option = createOption(filterValue[1], filterValue[0], values.includes(filterValue[1]))
        if (filterValue.length == 3) {
          let optgroup = Array.from(select.querySelectorAll('optgroup')).filter((el) => (el.getAttribute('label') === filterValue[2]));
          if (optgroup.length === 0) {
            optgroup = document.createElement('optgroup');
            optgroup.setAttribute('label', filterValue[2]);
          }
          optgroup.append(option);
          option = optgroup;
        }
      } else {
        option = createOption(filterValue, filterValue, values.includes(filterValue))
      }
      select.append(option);
    });
    break;
  case "date":
  case "date_past":
    tr.querySelector('.values').insertAdjacentHTML('beforeend',
       `<span style="display:none;"><input type="date" name="v[${field}][]" id="values_${fieldId}_1" size="10" class="value date_value" data-controller="datepicker-dispatcher" data-action="click->datepicker-dispatcher#dispatch"/></span>
        <span style="display:none;"><input type="date" name="v[${field}][]" id="values_${fieldId}_2" size="10" class="value date_value" data-controller="datepicker-dispatcher" data-action="click->datepicker-dispatcher#dispatch"/></span>
        <span style="display:none;"><input type="text" name="v[${field}][]" id="values_${fieldId}" size="3" class="value" /> ${labelDayPlural}</span>`);
    setValue(`values_${fieldId}`, values[0]);
    break;
  case "string":
  case "text":
  case "search":
    tr.querySelector('.values').insertAdjacentHTML('beforeend',
      `<span style="display:none;"><input type="text" name="v[${field}][]" id="values_${fieldId}" size="30" class="value" /></span>`
    );
    setValue(`values_${fieldId}`, values[0]);
    break;
  case "relation":
    tr.querySelector('.values').insertAdjacentHTML('beforeend',
      `<span style="display:none;"><input type="text" name="v[${field}][]" id="values_${fieldId}" size="6" class="value" /></span>
       <span style="display:none;"><select class="value" name="v[${field}][]" id="values_${fieldId}_1"></select></span>`
    );
    setValue(`values_${fieldId}`, values[0]);
    select = tr.querySelector('.values select');
    filterValues.forEach((filterValue) => {
      const option = createOption(filterValue[1], filterValue[0], values[0] == filterValue[1])
      select.append(option);
    });
    break;
  case "integer":
  case "float":
  case "hour":
  case "tree":
    tr.querySelector('.values').insertAdjacentHTML('beforeend',
      `<span style="display:none;"><input type="text" name="v[${field}][]" id="values_${fieldId}_1" size="14" class="value" /></span>
       <span style="display:none;"><input type="text" name="v[${field}][]" id="values_${fieldId}_2" size="14" class="value" /></span>`
    );
    setValue(`values_${fieldId}_1`, values[0]);
    setValue(`values_${fieldId}_2`, values[1]);
    break;
  }
}

function setValue(selector, value) {
  const element = document.getElementById(selector);
  if (element !== null) {
    element.value = value;
  }
}

function createOption(value, text, selected) {
  const option = document.createElement('option');
  option.setAttribute('value', value);
  option.selected = selected;
  option.textContent = text;
  return option;
}

function toggleFilter(field) {
  const fieldId = field.replace('.', '_');
  const element = document.getElementById(`operators_${fieldId}`);
  const checkbox = document.getElementById(`cb_${fieldId}`);

  if (checkbox.checked) {
    element.style.display = '';
    element.removeAttribute('disabled');
    toggleOperator(field);
  } else {
    element.style.display = 'none';
    element.setAttribute('disabled', 'disabled');
    enableValues(field, []);
  }
}

function enableValues(field, indexes) {
  const fieldId = field.replace('.', '_');
  const selector = `#tr_${fieldId} .values .value`;
  Array.from(document.querySelectorAll(selector)).forEach((elem, index) => {
    if (indexes.includes(index)) {
      elem.disabled = false;
      elem.closest('span').style.display = '';
    } else {
      elem.value = '';
      elem.disabled = true;
      elem.closest('span').style.display = 'none';
    }

    if (elem.classList.contains('group')) {
      elem.classList.add('open');
    } else {
      elem.style.display = '';
    }
  })
}

function toggleOperator(field) {
  const fieldId = field.replace('.', '_');
  const operator = document.getElementById(`operators_${fieldId}`);
  switch (operator.value) {
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
