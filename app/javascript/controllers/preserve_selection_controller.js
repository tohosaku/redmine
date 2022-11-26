import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="preserve-selection"
export default class extends Controller {
  static values = {selector: String}

  connect() {
    this.checkedValues = {}
  }

  preserve(e) {
    if (!e.target.matches(this.selectorValue)) return;

    if (e.target.checked) {
      this.checkedValues[e.target.value] = true;
    } else {
      delete this.checkedValues[e.target.value];
    }
    this.restore();
  }

  save(e) {
    const elements = this.element.querySelectorAll(`${this.selectorValue}:not(.hidden-checked-value)`)
    Array.from(elements).forEach(e => {
      if (e.checked) {
        this.checkedValues[e.value] = true;
      } else {
        delete this.checkedValues[e.value];
      }
    })
  }

  restore(e) {
    const $form = $(this.element);

    const elements = this.element.querySelectorAll(`${this.selectorValue}:not(.hidden-checked-value)`)
    Array.from(elements).forEach(e => {
      if (checkedValues[e.value]) {
        e.checked = true;
      }
    })

    // Sync hidden inputs for checked values not visible as checkboxes
    Array.from(this.element.querySelectorAll('input.hidden-checked-value')).forEach(e => {
      e.remove();
    })
    const cbName = this.checkboxName();
    if (!cbName) return;

    Object.values(this.checkedValues).forEach(val => {
      if (this.element.querySelector(`${this.selectorValue}[value="${val}"]`) === null) {
        $form.append(
          $('<input type="hidden" class="hidden-checked-value">').attr('name', cbName).val(val)
        );
      }
    })
  }

  checkboxName() {
    return this.element.querySelector(this.selectorValue).getAttribute('name')
  }
}

/*
    var $form = cbSelector ? $this.closest('form') : null;
    function checkboxName() {
      if (!cbSelector) return null;
      return $form.find(cbSelector).first().attr('name');
    }

    function saveChecked() {
      if (!cbSelector) return;
      $form.find(cbSelector).not('.hidden-checked-value').each(function() {
        if ($(this).prop('checked')) {
          checkedValues[$(this).val()] = true;
        } else {
          delete checkedValues[$(this).val()];
        }
      });
    }

    function restoreChecked() {
      if (!cbSelector) return;
      // Restore checkboxes that are visible in the current page
      $form.find(cbSelector).not('.hidden-checked-value').each(function() {
        if (checkedValues[$(this).val()]) {
          $(this).prop('checked', true);
        }
      });
      // Sync hidden inputs for checked values not visible as checkboxes
      $form.find('input.hidden-checked-value').remove();
      var cbName = checkboxName();
      if (!cbName) return;
      $.each(checkedValues, function(val) {
        if ($form.find(cbSelector + '[value="' + val + '"]').length === 0) {
          $form.append(
            $('<input type="hidden" class="hidden-checked-value">').attr('name', cbName).val(val)
          );
        }
      });
    }

    if (cbSelector) {
      // Track checkbox changes via delegation
      $form.on('change', cbSelector, function() {
        if ($(this).prop('checked')) {
          checkedValues[$(this).val()] = true;
        } else {
          delete checkedValues[$(this).val()];
        }
        restoreChecked();
      });
      // Handle pagination (remote links replacing content)
      $form.on('ajax:before', 'a[data-remote]', function() {
        saveChecked();
      });
      $form.on('ajax:complete', 'a[data-remote]', function() {
        restoreChecked();
      });
    }

*/
