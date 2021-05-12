import '../stylesheets/application.css';

import jQuery from 'jquery';
import $ from 'jquery';

import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';

import Tribute from "tributejs";
import 'tributejs/dist/tribute.css';

import Tablesort from "tablesort";

import Rails from '@rails/ujs';
Rails.start();

window.jQuery = jQuery;
window.$ = $;
window.Tribute = Tribute;
window.Tablesort = Tablesort;
