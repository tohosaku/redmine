/**
 * This file is part of DotClear.
 * Copyright (c) 2005 Nicolas Martin & Olivier Meunier and contributors. All rights reserved.
 * This code is released under the GNU General Public License.
 *
 * Modified by JP LANG for common_mark formatting
 */

export default [
  { 
    name:'strong',
    type: 'button',
    title: 'Strong',
    shortcut: 'b',
    fn: {
      wiki: function() { this.singleTag('**') }
    }
  },
  {
    name: 'em',
    type: 'button',
    title: 'Italic',
    shortcut: 'i',
    fn: {
      wiki: function() { this.singleTag("*") }
    }
  },
  {
    name: 'del',
    type: 'button',
    title: 'Deleted',
    fn: {
      wiki: function() { this.singleTag('~~') }
    }
  },
  {
    name: 'code',
    type: 'button',
    title: 'Code',
    fn: {
      wiki: function() { this.singleTag('`') }
    }
  },
  {
    name: 'space1',
    type: 'space'
  },
  {
    name: 'h1',
    type: 'button',
    title: 'Heading 1',
    fn: {
      wiki: function() {
        this.encloseLineSelection('# ', '',function(str) {
          str = str.replace(/^#+\s+/, '')
          return str;
        });
      }
    }
  },
  {
    name: 'h2',
    type: 'button',
    title: 'Heading 2',
    fn: {
      wiki: function() {
        this.encloseLineSelection('## ', '',function(str) {
          str = str.replace(/^#+\s+/, '')
          return str;
        });
      }
    }
  },
  {
    name: 'h3', 
    type: 'button',
    title: 'Heading 3',
    fn: {
      wiki: function() {
        this.encloseLineSelection('### ', '',function(str) {
          str = str.replace(/^#+\s+/, '')
          return str;
        });
      }
    }
  },
  {
    name: 'space2',
    type: 'space'
  },
  {
    name: 'ul',
    type: 'button',
    title: 'Unordered list',
    fn: {
      wiki: function() {
        this.encloseLineSelection('','',function(str) {
          str = str.replace(/\r/g,'');
          return str.replace(/(\n|^)[#-]?\s*/g,"$1* ");
        });
      }
    }
  },
  {
    name: 'ol',
    type: 'button',
    title: 'Ordered list',
    fn: {
      wiki: function() {
        this.encloseLineSelection('','',function(str) {
          str = str.replace(/\r/g,'');
          return str.replace(/(\n|^)[*-]?\s*/g,"$11. ");
        });
      }
    }
  },
  {
    name: 'tl',
    type: 'button',
    title: 'Task list',
    fn: {
      wiki: function() {
        this.encloseLineSelection('','',function(str) {
          str = str.replace(/\r/g,'');
          return str.replace(/(\n|^)[*-]?\s*/g,"$1* [ ] ");
        });
      }
    }
  },
  {
    name: 'space3',
    type: 'space'
  },
  {
    name: 'bq',
    type: 'button',
    title: 'Quote',
    fn: {
      wiki: function() {
        this.encloseLineSelection('','',function(str) {
          str = str.replace(/\r/g,'');
          return str.replace(/(\n|^)( *)([^\n]*)/g,"$1> $2$3");
        });
      }
    }
  },
  {
    name: 'unbq',
    type: 'button',
    title: 'Unquote',
    fn: {
      wiki: function() {
        this.encloseLineSelection('','',function(str) {
          str = str.replace(/\r/g,'');
          return str.replace(/(\n|^) *(> ?)?( *)([^\n]*)/g,"$1$3$4");
        });
      }
    }
  },
  {
    name: 'table',
    type: 'button',
    title: 'Table',
    fn: {
      wiki: function() {
        this.tableMenu((cols, rowCount) => {
          this.encloseLineSelection(
            '|'+cols.join(' |')+' |\n' +                                   // header
            Array(cols.length+1).join('|--')+'|\n' +                       // second line
            Array(rowCount+1).join(Array(cols.length+1).join('|  ')+'|\n') // cells
          );
        });
      }
    }
  },
  {
    name: 'pre',
    type: 'button',
    title: 'Preformatted text',
    fn: {
      wiki: function() { this.encloseLineSelection('```\n', '\n```') }
    }
  },
  {
    name: 'precode',
    type: 'button',
    title: 'Highlighted code',
    fn: {
      wiki: function() {
        var This = this;
        this.precodeMenu(function(lang){
          This.encloseLineSelection('``` ' + lang + '\n', '\n```\n');
        });
      }
    }
  },
  {
    name: 'space4',
    type: 'space'
  },
  {
    name: 'link',
    type: 'button',
    title: 'Wiki link',
    fn: {
      wiki: function() { this.encloseSelection("[[", "]]") }
    }
  },
  {
    name: 'img',
    type: 'button',
    title: 'Image',
    fn: {
      wiki: function() { this.encloseSelection("![](", ")") }
    }
  },
  {
    name: 'space5',
    type: 'space'
  },
  {
    name: 'help',
    type: 'button',
    title: 'Help',
    fn: {
      wiki: function() { window.open(this.help_link, '', 'resizable=yes, location=no, width=300, height=640, menubar=no, status=no, scrollbars=yes') }
    }
  }
]
//document.dispatchEvent(new Event('redmine:jstoolbar:load'));
