/**
 * This file is part of DotClear.
 * Copyright (c) 2005 Nicolas Martin & Olivier Meunier and contributors. All rights reserved.
 * This code is released under the GNU General Public License.
 *
 * Modified by JP LANG for common_mark formatting
 */

export default {
  makeListFormatter: () => {
    const listFormatter = new ListFormatter()
    return (line) => listFormatter.format(line)
  },

  elements: [
    {
      name: 'strong',
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
      name: 'ins',
      type: 'button',
      title: 'Underline',
      shortcut: 'u',
      fn: {
        wiki: function() { this.singleTag('<u>', '</u>') }
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
        wiki: function() { this.showHelp() }
      }
    }
  ]
}

class ListFormatter {
  // Example: '  * text'  → indent='  ', bullet='*', content='text' (or '+' or '-')
  #bulletItemPattern  = /^(?<indent>\s*)(?<bullet>[*+\-]) (?<content>.*)$/;
  // Example: '  1. text' → indent='  ', num='1', delimiter='.', content='text' (or ')')
  #orderedItemPattern = /^(?<indent>\s*)(?<num>\d+)(?<delimiter>[.)]) (?<content>.*)$/;
  // Example: '[ ] Task'  → taskContent='Task'
  //          '[x] Task'  → taskContent='Task'
  #taskAtStartPattern = /^\[[ x]\] (?<taskContent>.*)$/;

  format(line) {
    const bulletMatch = line.match(this.#bulletItemPattern);
    if (bulletMatch) {
      return (
        this.#formatBulletTask(bulletMatch.groups) ||
        this.#formatBulletList(bulletMatch.groups)
      );
    }

    const orderedMatch = line.match(this.#orderedItemPattern);
    if (orderedMatch) {
      return (
        this.#formatOrderedTask(orderedMatch.groups) ||
        this.#formatOrderedList(orderedMatch.groups)
      );
    }
  }

  // '- [ ] Task' or '* [ ] Task' or '+ [ ] Task'
  #formatBulletTask({ indent, bullet, content }) {
    const m = content.match(this.#taskAtStartPattern);
    if (!m) return null;
    const taskContent = m.groups.taskContent;

    return taskContent === ''
      ? { action: 'remove' }
      : { action: 'insert', text: `${indent}${bullet} [ ] ` };
  }

  // '- Item' or '* Item' or '+ Item'
  #formatBulletList({ indent, bullet, content }) {
    return content === ''
      ? { action: 'remove' }
      : { action: 'insert', text: `${indent}${bullet} ` };
  }

  // '1. [ ] Task' or '1) [ ] Task'
  #formatOrderedTask({ indent, num, delimiter, content }) {
    const m = content.match(this.#taskAtStartPattern);
    if (!m) return null;
    const taskContent = m.groups.taskContent;

    const next = `${Number(num) + 1}${delimiter}`;
    return taskContent === ''
      ? { action: 'remove' }
      : { action: 'insert', text: `${indent}${next} [ ] ` };
  }

  // '1. Item' or '1) Item'
  #formatOrderedList({ indent, num, delimiter, content }) {
    const next = `${Number(num) + 1}${delimiter}`;
    return content === ''
      ? { action: 'remove' }
      : { action: 'insert', text: `${indent}${next} ` };
  }
}
