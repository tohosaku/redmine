import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';
import css from "rollup-plugin-import-css";
import path from "node:path";
import fs from "fs";
import * as pkg from './package-lock.json' with { type: 'json' };

const __dirname = import.meta.dirname;
const deps = pkg.default.packages[''].dependencies

// use same banner as projects
// https://unpkg.com/chart.js@4.5.0
// https://unpkg.com/@kurkle/color@0.3.2
const chartbanner = `/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
`;

export default [
  {
    input: "src/wc-datepicker.js",
    output: {
      name: "wc-datepicker",
      file: "../../vendor/javascript/wc-datepicker.js",
      banner: `/* wc-datepicker.js v${deps['wc-datepicker']} license MIT */`,
      format: "esm"
    },
    plugins: [
      resolve(),
      terser({
        format: {
          comments: (node, comments) => {
            if (comments.value.match(/wc-datepicker\.js .* MIT/)) {
              return comments.value;
            }
          },
        }
      }),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-env"]]
      }),
      css({
        output: "wc-datepicker.css",
        minify: true
      }),
      moveAssets({
        from: path.resolve(__dirname, "../../vendor/javascript/wc-datepicker.css"),
        to: path.resolve(__dirname, "../../vendor/assets/stylesheets/wc-datepicker.css")
      })
    ]
  },
  {
    input: "src/Chart.js",
    output: {
      name: "Chart",
      file: "../../vendor/javascript/Chart.js",
      format: "esm",
      banner: chartbanner
    },
    plugins: [
      resolve(),
      terser(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-env"]]
      })
    ]
  }
];

function moveAssets(options = {}) {
  return {
    name: 'move-assets',
    async closeBundle() {
      fs.renameSync(options.from, options.to);
    }
  }
}
