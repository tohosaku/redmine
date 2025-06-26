import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';
import css from "rollup-plugin-import-css";
import path from "node:path";
import fs from "fs";
import * as pkg from './package-lock.json' with { type: 'json' };

const __dirname = import.meta.dirname;
const deps = pkg.default.packages[''].dependencies

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
    input: 'src/imask_date.js',
    output: {
      file: "../../vendor/javascript/imask_date.min.js",
      banner: `/* imask.js v${deps['imask']} license MIT */`,
      format: 'esm'
    },
    plugins: [
      resolve(),
      terser({
        format: {
          comments: (node, comments) => {
            if (comments.value.match(/imask\.js .* MIT/)) {
              return comments.value;
            }
          }
        }
      })
    ],
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
