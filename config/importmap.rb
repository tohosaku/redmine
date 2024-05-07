# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin "application"
pin "tooltip"
pin "helper"
pin "svg_drawer"
pin "gantt", preload: false
pin "revision_graph"
pin "jstoolbar", preload: false
pin_all_from "app/javascript/jstoolbar/formatting", under: "jstoolbar/formatting", preload: false

pin "wc-datepicker", to: "wc-datepicker.js"
pin "@redmine-ui/tribute", to: "tribute.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "turndown" # @7.2.0
pin_all_from "app/javascript/controllers", under: "controllers"
