# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap
pin "redmine", preload: true
pin "context_menu", preload: true
pin "dom", preload: true

pin "flatpickr", to: "flatpickr-4.6.13.min.js", preload: true
pin_all_from "vendor/assets/javascripts/flatpickr", under: "flatpickr", to: "flatpickr", preload: false
pin "jstoolbar", preload: true
pin_all_from "app/javascript/jstoolbar", under: "jstoolbar", to: "jstoolbar", preload: false
pin "@redmine-ui/tribute", to: "tribute-6.0.0.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
