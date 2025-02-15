import TabController from "controllers/tab_controller"
import { replaceInHistory } from 'helper'

// Connects to data-controller="issues--show"
export default class extends TabController {
  show(e) {
    e.preventDefault();
    this.showHistory(e.params.name, e.currentTarget.href)
    this.setCookie(e.params.name)
  }

  setCookie(name) {
    document.cookie = 'history_last_tab=' + name + '; SameSite=Lax'
  }

  showHistory(name, url) {

    const tab_content = document.getElementById('tab-content-history');
    tab_content.parentNode.querySelectorAll('.tab-content').forEach(elm => elm.style.display = 'none');
    tab_content.style.display = ''
    Array.from(tab_content.parentNode.children).forEach(elm => {
      if (elm.matches('div.tabs')) {
        elm.querySelectorAll('a').forEach(elm => {
          elm.classList.remove('selected');
        })
      }
    })

    document.getElementById('tab-' + name).classList.add('selected');

    replaceInHistory(url)

    switch(name) {
      case 'notes':
        setVisibility(tab_content.querySelectorAll('.journal'), true);
        setVisibility(tab_content.querySelectorAll('.journal:not(.has-notes)'), false);
        setVisibility(tab_content.querySelectorAll('.journal .wiki'), true);
        setVisibility(tab_content.querySelectorAll('.journal .contextual .journal-actions'), true);

        // always show thumbnails in notes tab
        const thumbnails = tab_content.querySelectorAll('.journal .thumbnails');
        setVisibility(thumbnails, true);
        // show journals without notes, but with thumbnails
        thumbnails.forEach(t => setVisibility(t.parents('.journal'), true));
        break;
      case 'properties':
        setVisibility(tab_content.querySelectorAll('.journal'), true);
        setVisibility(tab_content.querySelectorAll('.journal:not(.has-details)'), false);
        setVisibility(tab_content.querySelectorAll('.journal .wiki'), false);
        setVisibility(tab_content.querySelectorAll('.journal .thumbnails'), false);
        setVisibility(tab_content.querySelectorAll('.journal .contextual .journal-actions'), false);
        break;
      default:
        setVisibility(tab_content.querySelectorAll('.journal'), true);
        setVisibility(tab_content.querySelectorAll('.journal .wiki'), true);
        setVisibility(tab_content.querySelectorAll('.journal .thumbnails'), true);
        setVisibility(tab_content.querySelectorAll('.journal .contextual .journal-actions'), true);
    }

    return false;
  }
}

function setVisibility(elements, visibility) {
  elements.forEach(elm => {
    if (visibility) {
      elm.style.display = '';
    } else {
      elm.style.display = 'true';
    }
  })
}
