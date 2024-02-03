import { get } from "@rails/request.js"
import { Controller } from "@hotwired/stimulus"
import { replaceInHistory } from 'helper'

// Connects to data-controller="tab"
export default class extends Controller {

  static targets = ['content', 'link']

  show(e) {
    e.preventDefault();

    this.showTab(e.currentTarget, e.params.name);
  }

  showTab(element, name) {
    this.contentTargets.forEach(t => t.style.display = 'none');
    const tab = this.contentTargets.find(t => t.id == `tab-content-${name}`)
    tab.style.display = '';

    this.linkTargets.forEach(e => e.classList.remove('selected'));
    element.classList.add('selected');

    replaceInHistory(element.href);
  }

  getRemoteTab(e) {
    e.preventDefault();

    const load_always = false;
    const name = e.params.name;
    const remote_url = e.params.remoteUrl;
    const url = e.params.url;

    const tab_content = document.getElementById(`tab-content-${name}`);
    const parent = tab_content.parentElement
    parent.querySelectorAll('.tab-content').forEach(element => {
      element.style.display = 'none';
    });
    Array.from(parent.children).forEach(element => {
      if (element.matches('div.tabs')) {
        element.querySelectorAll('a').forEach(link => link.classList.remove('selected'))
      }
    })
    document.getElementById(`tab-${name}`).classList.add('selected');

    replaceInHistory(url);

    if (tab_content.children.length == 0 && load_always == false) {
      get(
        remote_url
      ).then(res => {
        if (res.ok) {
          return res.html
        }
      }).then(html => {
        tab_content.innerHTML = html;
      })
    }

    tab_content.style.display = '';
  }

  linkTargetConnected(element) {
    if (element.classList.contains('selected') && element.dataset.action) {
      element.dispatchEvent(new Event('click'));
    }
  }
}
