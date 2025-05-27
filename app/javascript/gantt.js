/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import {createSVGDrawer} from 'svg_drawer';
import {switchClass, isMobile, updateSVGIcon, nextAll} from 'helper';

let draw_gantt = null;
let draw_top;
let draw_right;
let draw_left;

let rels_stroke_width = 2;

function setDrawArea(folder, area) {
  draw_top   = $(folder).position().top;
  draw_right = $(folder).width();
  draw_left  = $(area).scrollLeft();
}

function getRelationsArray() {
  var arr = new Array();
  $.each($('div.task_todo[data-rels]'), function(index_div, element) {
    if(!$(element).is(':visible')) return true;
    var element_id = $(element).attr("id");
    if (element_id != null) {
      var issue_id = element_id.replace("task-todo-issue-", "");
      var data_rels = $(element).data("rels");
      for (let rel_type_key in data_rels) {
        $.each(data_rels[rel_type_key], function(index_issue, element_issue) {
          arr.push({issue_from: issue_id, issue_to: element_issue,
                    rel_type: rel_type_key});
        });
      }
    }
  });
  return arr;
}

function drawRelations() {
  var arr = getRelationsArray();
  $.each(arr, function(index_issue, element_issue) {
    var issue_from = $("#task-todo-issue-" + element_issue["issue_from"]);
    var issue_to   = $("#task-todo-issue-" + element_issue["issue_to"]);
    if (issue_from.length == 0 || issue_to.length == 0) {
      return;
    }
    var issue_height = issue_from.height();
    var issue_from_top   = issue_from.position().top  + (issue_height / 2) - draw_top;
    var issue_from_right = issue_from.position().left + issue_from.width();
    var issue_to_top   = issue_to.position().top  + (issue_height / 2) - draw_top;
    var issue_to_left  = issue_to.position().left;
    var color = window.issue_relation_type[element_issue["rel_type"]]["color"];
    var landscape_margin = window.issue_relation_type[element_issue["rel_type"]]["landscape_margin"];
    var issue_from_right_rel = issue_from_right + landscape_margin;
    var issue_to_left_rel    = issue_to_left    - landscape_margin;
    draw_gantt.path(["M", issue_from_right + draw_left,     issue_from_top,
                     "L", issue_from_right_rel + draw_left, issue_from_top])
                   .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
    if (issue_from_right_rel < issue_to_left_rel) {
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_from_top,
                       "L", issue_from_right_rel + draw_left, issue_to_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_to_top,
                       "L", issue_to_left + draw_left,        issue_to_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
    } else {
      var issue_middle_top = issue_to_top +
                                (issue_height *
                                   ((issue_from_top > issue_to_top) ? 1 : -1));
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_from_top,
                       "L", issue_from_right_rel + draw_left, issue_middle_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
      draw_gantt.path(["M", issue_from_right_rel + draw_left, issue_middle_top,
                       "L", issue_to_left_rel + draw_left,    issue_middle_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
      draw_gantt.path(["M", issue_to_left_rel + draw_left, issue_middle_top,
                       "L", issue_to_left_rel + draw_left, issue_to_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
      draw_gantt.path(["M", issue_to_left_rel + draw_left, issue_to_top,
                       "L", issue_to_left + draw_left,     issue_to_top])
                     .attr({stroke: color,
                          "stroke-width": rels_stroke_width
                          });
    }
    draw_gantt.path(["M", issue_to_left + draw_left, issue_to_top,
                     "l", -4 * rels_stroke_width, -2 * rels_stroke_width,
                     "l", 0, 4 * rels_stroke_width, "z"])
                   .attr({stroke: "none",
                          fill: color,
                          "stroke-linecap": "butt",
                          "stroke-linejoin": "miter"
                          });
  });
}

function getProgressLinesArray(todayLine) {
  var arr = new Array();
  var today_left = $(todayLine).position().left;
  arr.push({left: today_left, top: 0});
  $.each($('div.issue-subject, div.version-name'), function(index, element) {
    if(!$(element).is(':visible')) return true;
    var t = $(element).position().top - draw_top ;
    var h = ($(element).height() / 9);
    var element_top_upper  = t - h;
    var element_top_center = t + (h * 3);
    var element_top_lower  = t + (h * 8);
    var issue_closed   = $(element).children('span').hasClass('issue-closed');
    var version_closed = $(element).children('span').hasClass('version-closed');
    if (issue_closed || version_closed) {
      arr.push({left: today_left, top: element_top_center});
    } else {
      var issue_done = $("#task-done-" + $(element).attr("id"));
      var is_behind_start = $(element).children('span').hasClass('behind-start-date');
      var is_over_end     = $(element).children('span').hasClass('over-end-date');
      if (is_over_end) {
        arr.push({left: draw_right, top: element_top_upper, is_right_edge: true});
        arr.push({left: draw_right, top: element_top_lower, is_right_edge: true, none_stroke: true});
      } else if (issue_done.length > 0) {
        var done_left = issue_done.first().position().left +
                           issue_done.first().width();
        arr.push({left: done_left, top: element_top_center});
      } else if (is_behind_start) {
        arr.push({left: 0 , top: element_top_upper, is_left_edge: true});
        arr.push({left: 0 , top: element_top_lower, is_left_edge: true, none_stroke: true});
      } else {
        var todo_left = today_left;
        var issue_todo = $("#task-todo-" + $(element).attr("id"));
        if (issue_todo.length > 0){
          todo_left = issue_todo.first().position().left;
        }
        arr.push({left: Math.min(today_left, todo_left), top: element_top_center});
      }
    }
  });
  return arr;
}

function drawGanttProgressLines(todayLine) {
  var arr = getProgressLinesArray(todayLine);
  var color = $(todayLine)
                    .css("border-left-color");
  var i;
  for(i = 1 ; i < arr.length ; i++) {
    if (!("none_stroke" in arr[i]) &&
        (!("is_right_edge" in arr[i - 1] && "is_right_edge" in arr[i]) &&
         !("is_left_edge"  in arr[i - 1] && "is_left_edge"  in arr[i]))
        ) {
      var x1 = (arr[i - 1].left == 0) ? 0 : arr[i - 1].left + draw_left;
      var x2 = (arr[i].left == 0)     ? 0 : arr[i].left     + draw_left;
      draw_gantt.path(["M", x1, arr[i - 1].top,
                       "L", x2, arr[i].top])
                   .attr({stroke: color, "stroke-width": 2});
    }
  }
}

export function drawSelectedColumns(){
  if ($("#draw_selected_columns").prop('checked')) {
    if(isMobile()) {
      $('td.gantt_selected_column').each(function(i) {
        $(this).hide();
      });
    }else{
      $('.gantt_subjects_container').addClass('draw_selected_columns');
      $('td.gantt_selected_column').each(function() {
        $(this).show();
        const column_name = $(this).attr('id');
        setResizableHandle(this)
      });
    }
  }else{
    $('td.gantt_selected_column').each(function (i) {
      $(this).hide();
      $('.gantt_subjects_container').removeClass('draw_selected_columns');
    });
  }
}

export function drawGanttHandler(folder, area, todayLine) {
  if(draw_gantt != null) {
    draw_gantt.clear();
  } else {
    draw_gantt = createSVGDrawer(folder);
  }
  setDrawArea(folder, area);
  drawSelectedColumns();
  if ($("#draw_progress_line").prop('checked')) {
    try{
      drawGanttProgressLines(todayLine);
    }catch(e){
    }
  }
  if ($("#draw_relations").prop('checked')) {
    drawRelations();
  }
  $('#content').addClass('gantt_content');
}

export function resizableSubjectColumn(){
  $('.issue-subject, .project-name, .version-name').each(function(){
    $(this).width($(".gantt_subjects_column").width()-$(this).position().left);
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

  function toggleClass(elem, class1, class2) {
    if (!elem) return;
    elem.classList.remove(class1);
    elem.classList.add(class2);
  }

  function getLeft(elem) {
    if (!elem) return 0;
    return elem.offsetLeft || parseInt(elem.style.left);
  }

  function getTop(elem) {
    if (!elem) return 0;
    return elem.offsetTop || parseInt(elem.style.top);
  }

  function nextAll(elem, tagName) {
    const nextAllElems = [];
    let targetElem = elem.nextElementSibling;
    while (targetElem) {
      if (!tagName || targetElem.tagName === tagName) {
        nextAllElems.push(targetElem);
      }
      targetElem = targetElem.nextElementSibling;
    }
    return nextAllElems;
  }

  class GanttItem {
    constructor(elem) {
      this.elem = elem;
      this.iconExpander = elem.querySelector(":scope > .icon.expander");
      this.left =
        getLeft(this.elem) + (this.iconExpander ? expanderWidth : 0);
      this.top = getTop(this.elem);
      this.isShown =
        this.elem.offsetWidth > 0 || this.elem.offsetHeight > 0;
      this.json = JSON.parse(this.elem.dataset.collapseExpand);
      this.numberOfRows = this.elem.dataset.numberOfRows;
      this.isCollapsed =
        this.iconExpander?.classList.contains("icon-collapsed");

      const selector =
        `[data-collapse-expand="${this.json.obj_id}"]` +
        `[data-number-of-rows="${this.numberOfRows}"]`;
      this.taskBars = document.querySelectorAll(
        `#gantt_area form > ${selector}`
      );
      this.selectedColumns = document.querySelectorAll(
        `td.gantt_selected_column ${selector}`
      );
    }

    toggleIcon(force = undefined) {
      if (this.isCollapsed === undefined) return false;

      this.elem.classList.remove("open");
      const svgIcon = this.iconExpander.getElementsByTagName("svg");

      if ((force === true && !(force === false)) || this.isCollapsed) {
        toggleClass(this.iconExpander, "icon-collapsed", "icon-expanded");
        this.elem.classList.add("open");
        if (svgIcon.length === 1) {
          updateSVGIcon(this.iconExpander, 'angle-down');
        }
      } else {
        toggleClass(this.iconExpander, "icon-expanded", "icon-collapsed");
        if (svgIcon.length === 1) {
          updateSVGIcon(this.iconExpander, 'angle-right');
        }
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

  const subject = new GanttItem(subjectElem);
  subject.toggleIcon();

  let totalHeight = 0;
  let outOfHierarchyTop = null;
  let firstItemTop = null;
  let collapsedStateHierarchy = new Map();
  collapsedStateHierarchy.set(subject.left, subject.isCollapsed);
  let prevItemLeft = subject.left;

  function updateGanttItemPositionAndView (ganttItem) {
    if (outOfHierarchyTop || ganttItem.left <= subject.left) {
      if (!outOfHierarchyTop) outOfHierarchyTop = ganttItem.top;

      const newTop =
        ganttItem.top +
        (subject.isCollapsed
          ? -outOfHierarchyTop + subject.top + subject.json.top_increment
          : totalHeight);

      ganttItem.move(newTop);
      return;
    }

    // Clear the collapsed state for levels deeper than the current hierarchy
    // level.
    if (prevItemLeft > ganttItem.left) {
      for (const left of collapsedStateHierarchy.keys()) {
        if (left >= ganttItem.left) collapsedStateHierarchy.delete(left);
      }
    }

    // Update the stored left value for the next loop
    prevItemLeft = ganttItem.left;

    if (!firstItemTop) {
      firstItemTop = subject.top + subject.json.top_increment;
    }

    if (
      (recursive && subject.isCollapsed) ||
      (!recursive && collapsedStateHierarchy.values().some((i) => i))
    ) {
      if (ganttItem.isShown) ganttItem.hide();
    } else {
      if (!ganttItem.isShown) ganttItem.show();
      ganttItem.move(firstItemTop + totalHeight);
      totalHeight += ganttItem.json.top_increment;
    }

    if (ganttItem.iconExpander) {
      collapsedStateHierarchy.set(ganttItem.left, ganttItem.isCollapsed);
      if (recursive && ganttItem.isCollapsed !== subject.isCollapsed) {
        ganttItem.toggleIcon();
      }
    }
  }

  // Get all subsequent DIV elements, convert to GanttItem,
  // and update their positions and view states.
  nextAll(subjectElem, "DIV")
    .map((elem) => new GanttItem(elem))
    .forEach(updateGanttItemPositionAndView);
}

export function disableUnavailableColumns(unavailable_columns) {
  $.each(unavailable_columns, function (index, value) {
    $('#available_c, #selected_c').children("[value='" + value + "']").prop('disabled', true);
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
