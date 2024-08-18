# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap
pin "redmine", preload: true

pin "flatpickr", to: "flatpickr-4.6.13.min.js", preload: true
pin_all_from "vendor/assets/javascripts/flatpickr", under: "flatpickr", to: "flatpickr", preload: false
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
