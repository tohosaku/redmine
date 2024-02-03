import TabController from "controllers/tab_controller"

// Connects to data-controller="issues--show"
export default class extends TabController {
  show(e) {
    e.preventDefault();
    this.showHistory(e.params.name, e.currentTarget.href)
  }

  showHistory(name, url) {

    const tab_content = $('#tab-content-history');
    tab_content.parent().find('.tab-content').hide();
    tab_content.show();
    tab_content.parent().children('div.tabs').find('a').removeClass('selected');

    $('#tab-' + name).addClass('selected');

    replaceInHistory(url)

    switch(name) {
      case 'notes':
        tab_content.find('.journal').show();
        tab_content.find('.journal:not(.has-notes)').hide();
        tab_content.find('.journal .wiki').show();
        tab_content.find('.journal .contextual .journal-actions').show();

        // always show thumbnails in notes tab
        var thumbnails = tab_content.find('.journal .thumbnails');
        thumbnails.show();
        // show journals without notes, but with thumbnails
        thumbnails.parents('.journal').show();
        break;
      case 'properties':
        tab_content.find('.journal').show();
        tab_content.find('.journal:not(.has-details)').hide();
        tab_content.find('.journal .wiki').hide();
        tab_content.find('.journal .thumbnails').hide();
        tab_content.find('.journal .contextual .journal-actions').hide();
        break;
      default:
        tab_content.find('.journal').show();
        tab_content.find('.journal .wiki').show();
        tab_content.find('.journal .thumbnails').show();
        tab_content.find('.journal .contextual .journal-actions').show();
    }

    return false;
  }
}
