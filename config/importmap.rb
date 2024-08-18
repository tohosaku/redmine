# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin "application"
pin "helper"
pin "jstoolbar", preload: false
pin_all_from "app/javascript/jstoolbar/formatting", under: "jstoolbar/formatting", preload: false

pin "@redmine-ui/tribute", to: "tribute.min.js"
pin "tooltip"
pin "@redmine-ui/tribute", to: "tribute.min.js"
pin "wc-datepicker", to: "wc-datepicker.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "turndown" # @7.2.0
pin_all_from "app/javascript/controllers", under: "controllers"
pin "tablesort", to: "tablesort.min.js"
pin "tablesort.number", to: "tablesort.number.min.js"
pin "chart.js", preload: false, to: "chart.min.js" # @4.5.1
