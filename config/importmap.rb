# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin "application"
pin "tooltip"
pin "helper"
pin "svg_drawer"
pin "gantt", preload: false
pin "revision_graph"
pin "jstoolbar", preload: false
pin "attachment", preload: false
pin_all_from "app/javascript/jstoolbar/formatting", under: "jstoolbar/formatting", preload: false
pin "context_menu"

pin "wc-datepicker", to: "wc-datepicker.js"
pin "@redmine-ui/tribute", to: "tribute.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "turndown" # @7.2.0
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "Chart", preload: false # @4.5.0
pin "tablesort", to: "tablesort.min.js"
pin "tablesort.number", to: "tablesort.number.min.js"
