// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "controllers"
import "@hotwired/turbo-rails"
import Tribute from '@redmine-ui/tribute'
import { get, post, put, patch, destroy } from '@rails/request.js'

Turbo.session.drive = false;

export function ajaxGet(element, func) {
  const loading = 'ajax-loading';
  return (text, cb) => {
    element.classList.add(loading)

    get(func(text), { responseKind: 'json' })
      .then(res => {
        if (!res.ok) throw new Error();

        return res.json;
      })
      .then(json => cb(json))
      .finally(() => element.classList.remove(loading));
  }
}

export function observeAutocomplete(element, source, options) {

  if (element.classList.contains('autocomplete')) return;


  const func = (typeof source === 'string') ? () => source
                                            : source

  const tribute = new Tribute(Object.assign({
    autocompleteMode: true,
    menuShowMinLength: 2,
    noMatchTemplate: '',
    lookup: 'label',
    values: ajaxGet(element, func)
  }, options));
  tribute.attach(element);

  element.classList.add('autocomplete');
}
