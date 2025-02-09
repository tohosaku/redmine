/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"

// generic layout specific responsive stuff goes here
// Connects to data-controller="responsive"
export default class extends Controller {
  initialize() {
    this.mediaQueryList = window.matchMedia('screen and (max-width: 899px)');
    this.mediaQueryList.addEventListener('change', (e) => {
      this.initMenu();
      this.dispatch('switch', { detail: { isMobile: e.matches }, target: window })
    })
  }

  connect() {
    this.mobileInit  = false;
    this.desktopInit = false;
    this.handlers    = []
    this.html        = document.querySelector('html')

    // init menu on page load
    this.initMenu();
  }

  /* menu init function for dom detaching and appending on mobile / desktop view */
  initMenu() {
    if(this.mediaQueryList.matches) {
      this.initMobileMenu();
    } else {
      this.initDesktopMenu();
    }
  }

  /* click handler for mobile menu toggle */
  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if(this.html.classList.contains('flyout-is-active')) {
      this.closeFlyout();
    } else {
      this.openFlyout();
    }
  }

  initMobileMenu(e) {
    /* only init mobile menu, if it hasn't been done yet */
    if(!this.mobileInit) {

      this.replace('#main-menu > ul', '.js-project-menu')
      this.replace('#top-menu .general-menu .top-menu__links > ul', '.js-general-menu')
      this.replace('#sidebar   > *' , '.js-sidebar')
      this.replace('#account   > ul', '.js-profile-menu')

      this.mobileInit  = true;
      this.desktopInit = false;
    }
  }

  initDesktopMenu(e) {
    if(!this.desktopInit) {

      const project = document.querySelector('.js-project-menu > ul')
      if (project !== null) {
        project.remove()
        document.querySelector('#main-menu').prepend(project)
      }
      const general = document.querySelector('.js-general-menu > ul')
      if (general !== null) {
        general.remove()
        document.querySelector('#top-menu .general-menu .top-menu__links').prepend(general)
      }
      this.replace('.js-sidebar      > *' , '#sidebar')

      let accountMenuParent = document.querySelector('#account .dropdown-content');
      if (accountMenuParent === null) {
        accountMenuParent = document.querySelector('#account');
      }
      this.replace('.js-profile-menu > ul', accountMenuParent)

      this.mobileInit  = false;
      this.desktopInit = true;
    }
  }

  replace(from, to) {
    const fromElem = document.querySelectorAll(from)
    const toElem   = typeof to === 'string' ? document.querySelector(to) : to;

    if (toElem !== null) {
      const toChildren = toElem.children
      toElem.replaceChildren(...toChildren, ...fromElem);
    }
  }

  openFlyout() {
    this.html.classList.add('flyout-is-active');
    this.handlers = ['#main', '#header'].map((selector) => {
      return addHandler(document, 'click', (e) => {
        if (e.target.matches('.js-flyout-menu-toggle-button')) return;
        if (e.target.closest(selector) === null) return;

        this.closeFlyout()
      })
    });
  }

  closeFlyout() {
    this.html.classList.remove('flyout-is-active');
    this.handlers.forEach(handler => handler());
  }
}

function addHandler(element, ...args) {
  element.addEventListener(...args);
  return () => element.removeEventListener(...args);
}
