/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */

export function createSVGDrawer(parent) {
  const ns = "http://www.w3.org/2000/svg"
  const svg = document.createElementNS(ns, 'svg');
  parent.appendChild(svg)

  class SVGSet {
    constructor() {
      this.elements = [];
    }

    push(element) {
      this.elements.push(element)
    }

    toFront() {
      this.elements.forEach(e => e.toFront())
    }

    toBack() {
      this.elements.forEach(e => e.toBack())
    }
  }

  class SVGElement {

    constructor(element, attrs={}) {
      this.node = element;
      this.attr(attrs);
    }

    attr(attrs) {
      Object.keys(attrs).forEach(key => {
        this.node.setAttribute(key, attrs[key]);
      })
      return this;
    }

    toBack() {
      const p = this.node.parentNode
      const self = p.removeChild(this.node);
      p.insertAdjacentElement('afterbegin', this.node);

      return this;
    }

    toFront() {
      const p = this.node.parentNode
      const self = p.removeChild(this.node);
      p.insertAdjacentElement('beforeend', this.node);

      return this;
    }
  }

  class SVGColor {
    constructor() {
      this.rgb = cacher(function (r, g, b) {
        function round (x) { return (x + 0.5) | 0 }
        return '#' + (16777216 | round(b) | (round(g) << 8) | (round(r) << 16)).toString(16).slice(1)
      })
    }

    /**
     * @description On each call returns next colour in the spectrum.
     *
     * @param {number} value #optional brightness, default is `0.75`
     * @return {string} hex representation of the colour
     */
    getColor(value) {
      const start = this.start = this.start || { h: 0, s: 1, b: value || 0.75 }
      const rgb = this.hsb2rgb(start.h, start.s, start.b)
      start.h += 0.075
      if (start.h > 1) {
        start.h = 0
        start.s -= 0.2
        start.s <= 0 && (this.start = { h: 0, s: 1, b: start.b })
      }
      return rgb.hex
    }

    /* hsb2rgb
    /**
     * @description Converts HSB values to RGB object.
     *
     * @param {number} h hue
     * @param {number} s saturation
     * @param {number} v value or brightness
     * @return {object} RGB object in format
     * {
     *     r (number) red,
     *     g (number) green,
     *     b (number) blue,
     *     hex (string) color in HTML/CSS format: #xxxxxx
     * }
     */
    hsb2rgb (h, s, v, o) {
      if (typeof h === 'object' && 'h' in h && 's' in h && 'b' in h) {
        v = h.b
        s = h.s
        o = h.o
        h = h.h
      }
      h *= 360
      let R, G, B, X, C
      h = (h % 360) / 60
      C = v * s
      X = C * (1 - Math.abs(h % 2 - 1))
      R = G = B = v - C

      h = ~~h
      R += [C, X, 0, 0, X, C][h]
      G += [X, C, C, X, 0, 0][h]
      B += [0, 0, X, C, C, X][h]
      return this.packageRGB(R, G, B, o)
    }

    packageRGB(r, g, b, o) {
      const isnan = { NaN: 1, Infinity: 1, '-Infinity': 1 }
      r *= 255
      g *= 255
      b *= 255
      const rgb = {
        r,
        g,
        b,
        hex: this.rgb(r, g, b),
        toString: function() { return this.hex; }
      }
      //.is(o, 'finite')
      !isnan.hasOwnProperty(+o) && (rgb.opacity = o)
      return rgb
    }
  }

  function cacher (f, scope, postprocessor) {
    function newf () {
      const arg = Array.prototype.slice.call(arguments, 0)
      const args = arg.join('\u2400')
      const cache = newf.cache = newf.cache || {}
      const count = newf.count = newf.count || []
      if (cache.hasOwnProperty(args)) {
        repush(count, args)
        return postprocessor ? postprocessor(cache[args]) : cache[args]
      }
      count.length >= 1e3 && delete cache[count.shift()]
      count.push(args)
      cache[args] = f.apply(scope, arg)
      return postprocessor ? postprocessor(cache[args]) : cache[args]
    }
    return newf
  }

  class SVGDrawer {
    constructor() {
      this.ns = "http://www.w3.org/2000/svg"
    }

    clear() {
      while(svg.firstChild){
        svg.removeChild(svg.firstChild);
      }
    }

    setSize(width, height) {
      svg.setAttribute('width', width)
      svg.setAttribute('height', height)
    }

    set() {
      return new SVGSet();
    }

    path(d) {
      const path = this.draw('path', {d: d.join(' ')});
      return path;
    }

    circle(x, y, r) {
      const circle = this.draw('circle', {cx: x, cy: y, r: r});
      return circle;
    }

    draw(type, attrs={}, parent=null) {
      const element = document.createElementNS(this.ns, type);
      const obj = new SVGElement(element, attrs)

      if (parent !== null) {
        parent.appendChild(element)
      } else {
        svg.appendChild(element)
      }
      return obj
    }

    color() {
      return new SVGColor();
    }
  }

  return new SVGDrawer()
}


