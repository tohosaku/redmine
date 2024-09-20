import { Controller } from "@hotwired/stimulus"
import { isVisible } from "helper"

// Connects to data-controller="tab-buttons"
export default class extends Controller {
  connect() {
    displayTabsButtons()
  }

  left(e) {
    e.preventDefault();
    moveTabLeft(e.currentTarget)
  }

  right(e) {
    e.preventDefault();
    moveTabRight(e.currentTarget)
  }
}

function parents(el, selector) {
  const parents = [];
  while ((el = el.parentNode) && el !== document) {
    if (!selector || el.matches(selector)) {
      parents.push(el);
    }
  }
  return parents;
}

function outerWidth(el) {
  const style = getComputedStyle(el);

  return (
    el.getBoundingClientRect().width +
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight)
  );
}

function moveTabRight(el) {
  const tab = parents(el, 'div.tabs')[0]
  const lis = Array.from(tab.querySelector('ul').children);
  const buttons = parents(el, 'div.tabs-buttons')
  const bw = outerWidth(buttons[0]);

  let tabsWidth = 0;
  let i = 0;
  lis.forEach((el) => {
    if (isVisible(el)) {
      tabsWidth += outerWidth(el);
    }
  });
  const width = tab.getBoundingClientRect().width;
  if (tabsWidth < width - bw) return;

  const siblings = [...el.parentNode.children].filter((child) => child.matches('.tab-left') && child !== el);
  siblings.forEach(el => el.classList.remove('disabled'))

  while (i < lis.length && !isVisible(lis[i])) {
    i++;
  }

  const w = lis[i].getBoundingClientRect().width;
  lis[i].style.display = 'none'
  if (tabsWidth - w < width - bw) {
    el.classList.add('disabled');
  }
}

function moveTabLeft(el) {
  const tab = parents(el, 'div.tabs')[0]
  const lis = Array.from(tab.querySelector('ul').children);
  let i = 0;
  while (i < lis.length && !isVisible(lis[i])) {
    i++;
  }
  if (i > 0) {
    lis[i - 1].style.display = ''
    const siblings = [...el.parentNode.children].filter((child) => child.matches('.tab-right') && child !== el);
    siblings.forEach(el => el.classList.remove('disabled'))
  }
  if (i <= 1) {
    el.classList.add('disabled');
  }
}

function displayTabsButtons() {
  let lis;
  let tabsWidth;
  let el;
  let numHidden;
  document.querySelectorAll('div.tabs').forEach(el => {
    const ul = el.querySelector('ul');
    if (ul === null) return;

    lis = Array.from(ul.children);
    tabsWidth = 0;
    numHidden = 0;
    lis.forEach((el) => {
      if (isVisible(el)) {
        tabsWidth += outerWidth(el);
      } else {
        numHidden++;
      }
    });
    const btn = el.querySelector('div.tabs-buttons')
    const bw = btn !== btn ? outerWidth(btn) : 0;
    if ((tabsWidth < el.getBoundingClientRect().width - bw) && (lis.length === 0 || isVisible(lis[0]))) {
      el.querySelectorAll('div.tabs-buttons').forEach(el => el.style.display = 'none')
    } else {
      el.querySelectorAll('div.tabs-buttons').forEach(el => {
        el.style.display = ''
        Array.from(el.children).forEach(el => {
          if (el.matches('button.tab-left')) {
            el.classList.toggle('disabled', numHidden == 0);
          }
        })
      })
    }
  });
}
