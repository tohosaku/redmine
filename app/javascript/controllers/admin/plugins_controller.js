import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static values = { latest: String, unknown: String, data: Object };

  checkForUpdates(e) {
    e.preventDefault();

    $('#ajax-indicator').show();

    jsonp({
      url: "https://www.redmine.org/plugins/check_updates",
      data: this.dataValue,
      timeout: 10000
    }).then(res => {
      const errorMessage = "Unable to retrieve plugin informations from www.redmine.org";

      if (!res.ok) throw new Error(errorMessage);

      return res.json();
    }).then(data => {
      $("table.plugins td.version span").addClass("unknown");

      Object.entries(data).forEach(([plugin_id, plugin_data]) => {
        const s = $(`tr#plugin-${plugin_id} td.version span`);
        s.removeClass("icon-ok icon-warning unknown");
        if (plugin_data.url) {
          if (s.parent("a").length>0) {
            s.unwrap();
          }
          s.addClass("found");
          s.wrap($("<a></a>").attr("href", plugin_data.url).attr("target", "_blank"));
        }
        if (plugin_data.c == s.text()) {
          s.addClass("icon-ok");
        } else if (plugin_data.c) {
          s.addClass("icon-warning");
          s.attr("title", `${this.latestValue}: ${plugin_data.c}`);
        }
      });
      $("table.plugins td.version span.unknown").addClass("icon-help").attr("title", this.unknownValue);
    }).catch(error => {
      alert(error);
    }).finally(() => {
      $('#ajax-indicator').hide();
    })
  }
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
