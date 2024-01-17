import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = ['version'];
  static values = { latest: String, unknown: String, data: Object, url: String, error: String };

  checkForUpdates(e) {
    e.preventDefault();

    const indicator = document.getElementById('ajax-indicator');
    indicator.style.display = '';

    jsonp({
      url: this.urlValue,
      data: this.dataValue,
      timeout: 10000
    }).then(res => {
      if (!res.ok) throw new Error(this.errorValue);

      return res.json();
    }).then(data => {
      // prepare
      this.versionTargets.forEach(span => span.classList.add('unknown'))

      // set data
      Object.entries(data).forEach(([plugin_id, plugin_data]) => {
        const span = this.versionTargets.find(s => s.dataset.pluginId === plugin_id)
        if (span === undefined) return;

        ['icon-ok', 'icon-warning', 'unknown'].forEach(k => span.classList.remove(k))

        if (plugin_data.url) {
          const parent = span.parentNode
          if (parent.matches('a')) {
            parent.replaceWith(span);
          }
          span.classList.add('found');
          const link = wrap(span, 'a');
          link.setAttribute('href', plugin_data.url)
          link.setAttribute('target', '_blank')
        }
        if (plugin_data.c == span.textContent) {
          span.classList.add('icon-ok');
        } else if (plugin_data.c) {
          span.classList.add('icon-warning');
          span.setAttribute('title', `${this.latestValue}: ${plugin_data.c}`);
        }
      });

      // finish
      this.versionTargets.forEach(span => {
        if (span.classList.contains('unknown')) {
          span.classList.add('icon-help');
          span.setAttribute('title', this.unknownValue)
        }
      })
    }).catch(error => {
      this.alert(error);
    }).finally(() => {
      indicator.style.display = 'none';
    })
  }

  alert(error) {
    window.alert(error);
  }
}

function wrap(el, tagName) {
  const wrappingElement = document.createElement('a');
  el.replaceWith(wrappingElement);
  wrappingElement.appendChild(el);
  return wrappingElement;
}

function jsonp({ url: url, data: data, timeout: timeout}) {
  function makeId() {
    const length = 16;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      let letterPos = parseInt(crypto.getRandomValues(new Uint8Array(1))[0] / 255 * charactersLength - 1, 10)
      result += characters[letterPos]
    }
    return result;
  }

  function object2query(arg, key = undefined) {
    if (typeof arg === 'string') {
      return `${key}=${arg}`
    } else {
      return Object.keys(arg).map(k => object2query(arg[k], key === undefined ? k : `${key}[${k}]`)).join('&')
    }
  }

  return new Promise(rs => {
    const script = document.createElement('script');
    const name = `_jsonp_${makeId()}`;
    const qstr = object2query(data);
    const clear = () => {
      script.remove();
      delete window[name];
    }

    const query = url.match(/\?/) ? `&callback=${name}&${qstr}`
                                  : `?callback=${name}&${qstr}`;
    setTimeout(clear, timeout);

    script.src = url + query;
    window[name] = json => {
      rs(new Response(JSON.stringify(json)));
      clear();
    };

    document.body.appendChild(script);
  })
}
