import { Controller } from "@hotwired/stimulus"
import { updateSVGIcon } from 'helper'

// Connects to data-controller="collapsible-sidebar"
export default class extends Controller {
  static targets = ['button', 'panel']

  connect() {
    this.setup()
    // draw the toggle button once the DOM is complete
    this.setupToggleButton()
  }

  toggle(e) {
    this.element.classList.add('animate');
    this.element.classList.toggle('collapsedsidebar');
    this.applyState();
    e.preventDefault();
  }

  panelTargetConnected(element) {
    element.style.visibility = 'visible';
  }

  setup() {
    // the key to use in local storage
    // this will later be expanded using the current controller and action to
    // allow for different sidebar states for different pages
    this.localStorageKey = 'redmine-sidebar-state';
    // function to set current sidebar state

    // determine previously stored sidebar state for this page
    if(this.canUseLocalStorage) {
      // determine current controller/action pair and use them as storage key
      const bodyClass = document.querySelector('body').getAttribute('class');
      if(bodyClass){
        try {
          this.localStorageKey += '-' + bodyClass.split(/\s+/).filter(function(s){
            return s.match(/(action|controller)-.*/);
          }).sort().join('-');
        } catch(e) {
          // in case of error (probably IE8), continue with the unmodified key
        }
      }
      const storedState = localStorage.getItem(this.localStorageKey);
      this.element.classList.toggle('collapsedsidebar', storedState === 'hidden');
    }
  }

  setState(state) {
    if(this.canUseLocalStorage){
      localStorage.setItem(this.localStorageKey, state);
    }
  }

  setupToggleButton() {
    this.applyState();
  }

  applyState() {
    if (!this.hasButtonTarget) return;

    if (this.element.classList.contains('collapsedsidebar')) {
      updateSVGIcon(this.buttonTarget, 'chevrons-left')
      this.setState('hidden');
    } else {
      updateSVGIcon(this.buttonTarget, 'chevrons-right')
      this.setState('visible');
    }
  }

  // true if local storage is available
  get canUseLocalStorage() {
    try {
      if('localStorage' in window){
        localStorage.setItem('redmine.test.storage', 'ok');
        const item = localStorage.getItem('redmine.test.storage');
        localStorage.removeItem('redmine.test.storage');
        if(item === 'ok') return true;
      }
    } catch (err) {}
    return false;
  }
}
