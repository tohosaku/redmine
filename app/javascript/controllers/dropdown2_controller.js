import { Controller } from "@hotwired/stimulus"
import { isMobile, nextAll, prevAll } from 'helper'

// This variable is used to focus selected project
let selected;

// Connects to data-controller="dropdown"
export default class extends Controller {
  connect() {
    this.autocomplete = Array.from(document.querySelectorAll('.drdn .autocomplete'));
    this.autocomplete.forEach(el => { el.value = '' })
    this.html = document.querySelector('html')
  }

  select(e) {
    if (this.html.classList.contains('flyout-is-active')) return;

    if (this.element.classList.contains("expanded")) {
      this.element.classList.remove("expanded");
    } else {
      document.querySelectorAll('.expanded').forEach(el => {
        el.classList.remove('expanded');
      })
      this.element.classList.add("expanded");
      const parent = this.element.parentElement;
      if (parent.matches('#project-jump')) {
        selected = document.querySelector('.drdn-items a.selected'); // Store selected project
        selected.focus(); // Calling focus to scroll to selected project
      }
      if (!isMobile()) {
        this.element.querySelector(".autocomplete").focus();
      }
      e.stopPropagation();
    }
  }

  focus(e) {
    const items = e.target.querySelector(".drdn-items");

    let focused = null;
    // If a project is selected set focused to selected only once
    if (selected) {
      focused = selected;
      selected = undefined;
    }
    else {
      focused = items.querySelector("a:focus");
    }
    switch (e.which) {
      case 40: //down
        if (focused !== null) {
          const next = nextAll(focused, "a");
          next[0].focus();
        } else {
          items.querySelector('a').focus();;
        }
        e.preventDefault();
        break;
      case 38: //up
        if (focused.length > 0) {
          const prev = prevAll(focused, "a");
          if (prev.length > 0) {
            prev[0].focus();
          } else {
            e.target.querySelector(".autocomplete").focus();
          }
          e.preventDefault();
        }
        break;
      case 35: //end
        if (focused.length > 0) {
          const next = nextAll(focused, "a");
          const last = next.length - 1;
          next[last].focus();
          e.preventDefault();
        }
        break;
      case 36: //home
        if (focused.length > 0) {
          const prev = prevAll(focused, "a");
          const last = prev.length - 1;
          prev[last].focus();
          e.preventDefault();
        }
        break;
    }
  }
}

/*
  $(document).click(function(e){
    if ($(e.target).closest(".drdn").length < 1) {
      $(".drdn.expanded").removeClass("expanded");
    }
  });
  */

