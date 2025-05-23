/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import {createSVGDrawer} from 'svg_drawer';
import {switchClass, isVisible, setDisplay, isMobile, updateSVGIcon, nextAll} from 'helper';

let draw_gantt = null;
let draw_top;
let draw_right;
let draw_left;

let rels_stroke_width = 2;

function position(el) {
  const {top, left} = el.getBoundingClientRect();
  const {marginTop, marginLeft} = getComputedStyle(el);
  return {
    top: top - parseInt(marginTop, 10),
    left: left - parseInt(marginLeft, 10)
  };
}

function width(el) {
  return el.getBoundingClientRect().width
}

function scrollLeft(el, value) {
  var win;
  if (el.window === el) {
    win = el;
  } else if (el.nodeType === 9) {
    win = el.defaultView;
  }

  if (value === undefined) {
    return win ? win.pageXOffset : el.scrollLeft;
  }

  if (win) {
    win.scrollTo(value, win.pageYOffset);
  } else {
    el.scrollLeft = value;
  }
}

function setDrawArea(folder, area) {
  draw_top   = position(folder).top;
  draw_right = width(folder);
  draw_left  = scrollLeft(area);
}

function getRelationsArray() {
  const arr = new Array();
  document.querySelectorAll('div.task_todo[data-rels]').forEach((element) => {
    if(!isVisible(element)) return true;
    const element_id = element.getAttribute('id');
    if (element_id != null) {
      const issue_id = element_id.replace("task-todo-issue-", "");
      const data_rels = element.dataset.rels;
      for (let rel_type_key in data_rels) {
        data_rels[rel_type_key].forEach(element_issue => {
          arr.push({issue_from: issue_id, issue_to: element_issue, rel_type: rel_type_key});
        });
      }
    }
  });
  return arr;
}

function drawRelations() {
  const arr = getRelationsArray();
  arr.forEach((element_issue) => {
    const issue_from = document.getElementById(`task-todo-issue-${element_issue["issue_from"]}`);
    const issue_to   = document.getElementById(`task-todo-issue-${element_issue["issue_to"]}`);
    if (issue_from === null || issue_to === null) return;

    const fromRect             = issue_from.getBoundingClientRect();
    const toRect               = issue_to.getBoundingClientRect();
    const issue_height         = fromRect.height;
    const issue_from_top       = fromRect.top  + (issue_height / 2) - draw_top;
    const issue_from_right     = fromRect.left + fromRect.width;
    const issue_to_top         = toRect.top  + (issue_height / 2) - draw_top;
    const issue_to_left        = toRect.left;
    const color                = window.issue_relation_type[element_issue["rel_type"]]["color"];
    const landscape_margin     = window.issue_relation_type[element_issue["rel_type"]]["landscape_margin"];
    const issue_from_right_rel = issue_from_right + landscape_margin;
    const issue_to_left_rel    = issue_to_left    - landscape_margin;

    const group = draw_gantt.group().attr({stroke: color,
                                       "stroke-width": rels_stroke_width
                                      });
    draw_gantt.path(["M", issue_from_right + draw_left,     issue_from_top,
                     "L", issue_from_right_rel + draw_left, issue_from_top], group)
    if (issue_from_right_rel < issue_to_left_rel) {
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_from_top,
                       "L", issue_from_right_rel + draw_left, issue_to_top], group)
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_to_top,
                       "L", issue_to_left + draw_left,        issue_to_top], group)
    } else {
      const issue_middle_top = issue_to_top +
                                (issue_height *
                                   ((issue_from_top > issue_to_top) ? 1 : -1));
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_from_top,
                       "L", issue_from_right_rel + draw_left, issue_middle_top], group)
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_middle_top,
                       "L", issue_to_left_rel + draw_left,    issue_middle_top], group)
      draw_gantt.path(["M", issue_to_left_rel + draw_left, issue_middle_top,
                       "L", issue_to_left_rel + draw_left, issue_to_top], group)
      draw_gantt.path(["M", issue_to_left_rel + draw_left, issue_to_top,
                       "L", issue_to_left + draw_left,     issue_to_top], group)
    }
    draw_gantt.path(["M", issue_to_left + draw_left, issue_to_top,
                     "l", -4 * rels_stroke_width, -2 * rels_stroke_width,
                     "l", 0, 4 * rels_stroke_width, "z"])
                   .attr({stroke: "none",
                          fill: color,
                          "stroke-linecap": "butt",
                          "stroke-linejoin": "miter"
                          }, group);
  });
}

function getProgressLinesArray(todayLine) {
  const arr = new Array();
  const todayRect = todayLine.getBoundingClientRect();
  const today_left = todayRect.left
  arr.push({left: today_left, top: 0});

  document.querySelectorAll('div.issue-subject, div.version-name').forEach((element) => {
    if(!isVisible(element)) return;

    const rect = element.getBoundingClientRect();
    const t    = rect.top - draw_top ;
    const h    = rect.height / 9;
    const element_top_upper  = t - h;
    const element_top_center = t + (h * 3);
    const element_top_lower  = t + (h * 8);
    const children           = element.querySelectorAll(':scope span');
    const issue_closed       = children.some(element => element.claslist.conains('issue-closed'));
    const version_closed     = children.some(element => element.claslist.conains('version-closed'));

    if (issue_closed || version_closed) {
      arr.push({left: today_left, top: element_top_center});
    } else {
      const element_id      = element.getAttribute('id');
      const issue_done      = document.getElementById(`task-done-${element_id}`);
      const is_behind_start = children.some(element => element.claslist.conains('behind-start-date'));
      const is_over_end     = children.some(element => element.claslist.conains('over-end-date'));

      if (is_over_end) {
        arr.push({left: draw_right, top: element_top_upper, is_right_edge: true});
        arr.push({left: draw_right, top: element_top_lower, is_right_edge: true, none_stroke: true});
      } else if (issue_done !== null) {
        const rect = issue_done.getBoundingClientRect();
        const done_left = rect.left + rect.width;
        arr.push({left: done_left, top: element_top_center});
      } else if (is_behind_start) {
        arr.push({left: 0 , top: element_top_upper, is_left_edge: true});
        arr.push({left: 0 , top: element_top_lower, is_left_edge: true, none_stroke: true});
      } else {
        const todo_left = today_left;
        const issue_todo = document.getElementById(`task-todo-${element_id}`);

        if (issue_todo !== null) {
          const rect = issue_todo.getBoundingClientRect();
          todo_left = rect.left;
        }
        arr.push({left: Math.min(today_left, todo_left), top: element_top_center});
      }
    }
  });
  return arr;
}

function drawGanttProgressLines(todayLine) {
  const arr = getProgressLinesArray(todayLine);
  const color = getComputedStyle(todayLine)["border-left-color"];
  let i;
  for(i = 1 ; i < arr.length ; i++) {
    if (!("none_stroke" in arr[i]) &&
        (!("is_right_edge" in arr[i - 1] && "is_right_edge" in arr[i]) &&
         !("is_left_edge"  in arr[i - 1] && "is_left_edge"  in arr[i]))
        ) {
      const x1 = (arr[i - 1].left == 0) ? 0 : arr[i - 1].left + draw_left;
      const x2 = (arr[i].left == 0)     ? 0 : arr[i].left     + draw_left;
      draw_gantt.path(["M", x1, arr[i - 1].top,
                       "L", x2, arr[i].top])
                   .attr({stroke: color, "stroke-width": 2});
    }
  }
}

export function drawSelectedColumns(options) {
  const elements = document.querySelectorAll('td.gantt_selected_column');
  const containers = document.querySelectorAll('.gantt_subjects_container');
  if (options['draw_selected_columns']) {
    if(isMobile()) {
      elements.forEach(element => {
        element.style.display = 'none'
      });
    } else {
      containers.forEach(element => element.classList.add('draw_selected_columns'))
      elements.forEach(element => {
        element.style.display = ''
        const column_name = element.getAttribute('id');
        setResizableHandle(element)
      });
    }
  } else {
    elements.forEach(element => {
      element.style.display = 'none'
      containers.forEach(element => element.classList.remove('draw_selected_columns'))
    });
  }
}

export function drawGanttHandler(folder, area, todayLine, options) {
  if(draw_gantt != null) {
    draw_gantt.clear();
  } else {
    draw_gantt = createSVGDrawer(folder);
  }
  setDrawArea(folder, area);
  drawSelectedColumns(options);
  if (options['draw_progress_line']) {
    try{
      drawGanttProgressLines(todayLine);
    }catch(e){
    }
  }
  if (options['draw_relations']) {
    drawRelations();
  }
  document.getElementById('content').classList.add('gantt_content')
}

export function resizableSubjectColumn(){
  document.querySelectorAll('.issue-subject, .project-name, .version-name').forEach(element => {
    const rect1 = document.querySelector('.gantt_subjects_column').getBoundingClientRect()
    const rect2 = element.getBoundingClientRect();
    const width = rect1.width - rect2.left;
    element.style.width = `${width}px`;
  });

  if (!isMobile()) {
    const element = document.querySelector('td.gantt_subjects_column');
    setResizableHandle(element)
  }
}

export function ganttEntryClick(e) {
  const iconExpanderElem = e.target.closest('.expander');
  const subjectElem = iconExpanderElem.parentElement;
  const expanderWidth = iconExpanderElem.offsetWidth;
  const recursive = e.ctrlKey;

  function getLeft(elem) {
    if (!elem) return 0;
    return elem.offsetLeft || parseInt(elem.style.left);
  }

  function getTop(elem) {
    if (!elem) return 0;
    return elem.offsetTop || parseInt(elem.style.top);
  }

  class GanttItem {
    constructor(elem) {
      this.elem = elem;
      this.iconExpander = elem.querySelector(":scope > .icon.expander");
      this.left = getLeft(this.elem) + (this.iconExpander ? expanderWidth : 0);
      this.top = getTop(this.elem);
      this.isShown = this.elem.offsetWidth > 0 || this.elem.offsetHeight > 0;
      this.json = JSON.parse(this.elem.dataset.collapseExpand);
      this.numberOfRows = this.elem.dataset.numberOfRows;
      this.isCollapsed = this.iconExpander?.classList.contains("icon-collapsed");

      const selector = `[data-collapse-expand="${this.json.obj_id}"]` + `[data-number-of-rows="${this.numberOfRows}"]`;
      this.taskBars = document.querySelectorAll( `#gantt_area form > ${selector}`);
      this.selectedColumns = document.querySelectorAll( `td.gantt_selected_column ${selector}`);
    }

    toggleIcon(force = undefined) {
      if (this.isCollapsed === undefined) return false;

      const svgIcon = this.iconExpander.getElementsByTagName("svg");
      const open    = (force === true && !(force === false)) || this.isCollapsed

      switchClass(this.iconExpander, "icon-collapsed", "icon-expanded", !open);
      this.elem.classList.toggle("open", open);

      if (svgIcon.length === 1) {
        const iconType = open ? 'angle-down' : 'angle-right';
        updateSVGIcon(this.iconExpander, iconType);
      }

      this.isCollapsed = !this.isCollapsed;
      return true;
    }

    #setDisplayStyle(displayStyle) {
      this.taskBars.forEach((taskBar) => {
        taskBar.style.display = displayStyle;
      });
      this.selectedColumns.forEach((selectedColumn) => {
        selectedColumn.style.display = displayStyle;
      });
      this.elem.style.display = displayStyle;
    }

    hide() {
      this.#setDisplayStyle("none");
      this.isShown = false;
    }

    show() {
      this.#setDisplayStyle("");
      this.isShown = true;
    }

    move(top) {
      this.top = top;
      this.taskBars.forEach((taskBar) => {
        taskBar.style.top = `${top}px`;
      });
      this.selectedColumns.forEach((selectedColumn) => {
        selectedColumn.style.top = `${top}px`;
      });
      this.elem.style.top = `${top}px`;
    }
  }

  class GanttView {
    constructor(subject) {
      this.totalHeight = 0;
      this.outOfHierarchyTop = null;
      this.firstItemTop = null;
      this.collapsedStateHierarchy = new Map();
      this.prevItemLeft = subject.left;
      this.collapsedStateHierarchy.set(subject.left, subject.isCollapsed);
      this.subject = subject
    }

    updatePositionOf(item, recursive) {
      if (this.outOfHierarchyTop || item.left <= this.subject.left) {
        if (!this.outOfHierarchyTop) {
          this.outOfHierarchyTop = item.top;
        }
        const newTop = item.top + (this.subject.isCollapsed ? -this.outOfHierarchyTop + this.subject.top + this.subject.json.top_increment
                                                            : this.totalHeight);

        item.move(newTop);
        return;
      }

      // Clear the collapsed state for levels deeper than the current hierarchy
      // level.
      if (this.prevItemLeft > item.left) {
        for (const left of this.collapsedStateHierarchy.keys()) {
          if (left >= item.left) {
            this.collapsedStateHierarchy.delete(left);
          }
        }
      }

      // Update the stored left value for the next loop
      this.prevItemLeft = item.left;

      if (!this.firstItemTop) {
        this.firstItemTop = this.subject.top + this.subject.json.top_increment;
      }

      if (
        (recursive && this.subject.isCollapsed) ||
        (!recursive && this.collapsedStateHierarchy.values().some((i) => i))
      ) {
        if (item.isShown) {
          item.hide();
        }
      } else {
        if (!item.isShown) {
          item.show();
        }
        item.move(this.firstItemTop + this.totalHeight);
        this.totalHeight += item.json.top_increment;
      }

      if (item.iconExpander) {
        this.collapsedStateHierarchy.set(item.left, item.isCollapsed);
        if (recursive && item.isCollapsed !== this.subject.isCollapsed) {
          item.toggleIcon();
        }
      }
    }
  }

  const subject = new GanttItem(subjectElem);
  subject.toggleIcon();

  const view = new GanttView(subject);

  // Get all subsequent DIV elements, convert to GanttItem,
  // and update their positions and view states.
  nextAll(subjectElem, "DIV")
    .forEach(elem => {
      const item = new GanttItem(elem);
      view.updatePositionOf(item, recursive);
    });
}

export function disableUnavailableColumns(unavailable_columns) {
  const elements = document.querySelectorAll('#available_c, #selected_c')
  unavailable_columns.forEach((value) => {
    elements.forEach(element => {
      element.querySelectorAll(`:scope [value='${value}']`).forEach(child => {
        child.disabled = true
      })
    });
  });
}

function setResizableHandle(element) {
  const createHandle = (elm) => {
    const height = elm.offsetHeight;
    const handle = document.createElement('div');
    handle.classList.add('resizable-handle')
    handle.style.height = height + 'px';

    return handle;
  }

  const handle = createHandle(element.closest('table'));
  element.appendChild(handle)
}
