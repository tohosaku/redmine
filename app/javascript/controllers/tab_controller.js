import { get } from "@rails/request.js"
import { Controller } from "@hotwired/stimulus"

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

    const $tab_content = $('#tab-content-' + name);

    $tab_content.parent().find('.tab-content').hide();
    $tab_content.parent().children('div.tabs').find('a').removeClass('selected');
    $('#tab-' + name).addClass('selected');

    replaceInHistory(url);

    if ($tab_content.children().length == 0 && load_always == false) {
      get(
        remote_url
      ).then(res => {
        if (res.ok) {
          return res.html
        }
      }).then(html => {
        $tab_content.html(html)
      })
    }

    $tab_content.show();
  }

  linkTargetConnected(element) {
    if (element.classList.contains('selected') && element.dataset.action) {
      element.dispatchEvent(new Event('click'));
    }
  }

  left(e) {
  }

  right(e) {
  }
}
