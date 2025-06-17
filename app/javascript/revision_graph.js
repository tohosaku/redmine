/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import {createSVGDrawer} from 'svg_drawer';

var revisionGraph = null;

function position(el) {
  const {top, left} = el.getBoundingClientRect();
  const {marginTop, marginLeft} = getComputedStyle(el);
  return {
    top: top - parseInt(marginTop, 10),
    left: left - parseInt(marginLeft, 10)
  };
}

function height(el) {
  return el.getBoundingClientRect().height
}

function last(array) {
  return array[array.length -1]
}

export function drawRevisionGraph(holder, commits_hash, graph_space) {
    const XSTEP               = 20;
    const CIRCLE_INROW_OFFSET = 10;
    const commits_by_scmid    = commits_hash;
    const commits             = Object.keys(commits_by_scmid).map((k) => commits_by_scmid[k]);
    const max_rdmid           = commits.length - 1;
    const commit_table_rows   = document.querySelectorAll('table.changesets tr.changeset');

    // create graph
    if (revisionGraph != null) {
      revisionGraph.clear();
    } else {
      revisionGraph = createSVGDrawer(holder);
    }

    const top = revisionGraph.set();
    // init dimensions
    const graph_x_offset   = position(commit_table_rows[0].querySelector('td')).left - position(holder).left;
    const graph_y_offset   = position(holder).top;
    const graph_right_side = graph_x_offset + (graph_space + 1) * XSTEP;
    const graph_bottom     = position(last(commit_table_rows)).top + height(last(commit_table_rows)) - graph_y_offset;

    const yForRow = function (index, commit) {
      const row   = commit_table_rows[index];
      const first = getComputedStyle(row.querySelector('td'))['vertical-align']

      switch (first) {
        case "middle":
          return position(row).top + (height(row) / 2) - graph_y_offset;
        default:
          return position(row).top + - graph_y_offset + CIRCLE_INROW_OFFSET;
      }
    };

    revisionGraph.setSize(graph_right_side, graph_bottom);

    // init colors
    const colors = [];
    const svgcolor = revisionGraph.color();
    for (var k = 0; k <= graph_space; k++) {
      colors.push(svgcolor.getColor());
    }

    let parent_commit;
    let x, y, parent_x, parent_y;
    let path, title;
    let revision_dot_overlay;
    commits.forEach((commit, index) => {
        if (!commit.hasOwnProperty("space")) {
            commit.space = 0;
        }

        y = yForRow(max_rdmid - commit.rdmid);
        x = graph_x_offset + XSTEP / 2 + XSTEP * commit.space;
        revisionGraph.circle(x, y, 3)
            .attr({
                fill: colors[commit.space],
                stroke: 'none'
            }).toFront();
        // paths to parents
        commit.parent_scmids.forEach((parent_scmid, index) => {
            parent_commit = commits_by_scmid[parent_scmid];
            if (parent_commit) {
                if (!parent_commit.hasOwnProperty("space"))
                    parent_commit.space = 0;

                parent_y = yForRow(max_rdmid - parent_commit.rdmid);
                parent_x = graph_x_offset + XSTEP / 2 + XSTEP * parent_commit.space;
                if (parent_commit.space == commit.space) {
                    // vertical path
                    path = revisionGraph.path([
                        'M', x, y,
                        'V', parent_y]);
                } else {
                    // path to a commit in a different branch (Bezier curve)
                    path = revisionGraph.path([
                        'M', x, y,
                        'C', x, y, x, y + (parent_y - y) / 2, x + (parent_x - x) / 2, y + (parent_y - y) / 2,
                        'C', x + (parent_x - x) / 2, y + (parent_y - y) / 2, parent_x, parent_y-(parent_y-y)/2, parent_x, parent_y]);
                }
            } else {
                // vertical path ending at the bottom of the revisionGraph
                path = revisionGraph.path([
                    'M', x, y,
                    'V', graph_bottom]);
            }
            path.attr({stroke: colors[commit.space], "stroke-width": 1.5}).toBack();
        });
        revision_dot_overlay = revisionGraph.circle(x, y, 10);
        revision_dot_overlay
            .attr({
                fill: '#000',
                opacity: 0,
                cursor: 'pointer',
                href: commit.href
            });

        if (commit.refs != null && commit.refs.length > 0) {
            title = revisionGraph.draw('title', revision_dot_overlay.node)
            title.node.appendChild(document.createTextNode(commit.refs));
        }
        top.push(revision_dot_overlay);
    });
    top.toFront();
};
