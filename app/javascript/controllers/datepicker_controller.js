import { Controller } from "@hotwired/stimulus"
import flatpickr from 'flatpickr'

// Connects to data-controller="datepicker"
export default class extends Controller {

  connect() {
    const options = {
      dateFormat: 'Y-m-d',
      locale: {
        firstDayOfWeek: this.firstDayOfWeek
      }
    };
    if (this.language == 'en') {
      flatpickr(this.element, options)
    } else {
      import(`flatpickr/l10n/${this.language}`)
        .then((mod) => {
          const {
            default: locale
          } = mod;
          options['locale'] = { ...locale[this.language], ...options['locale'] };
          flatpickr(this.element, options)
        })
    }
  }

  get firstDayOfWeek() {
    return document.head.querySelector("meta[name=start_of_week]").content
  }

  get language() {
    return document.head.querySelector("meta[name=language]").content
  }
}
