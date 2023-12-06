class RevisionGraph {
  construnctor(holder) {
    this.XSTEP = 20;
    this.CIRCLE_INROW_OFFSET = 10;
    this.$commit_table_rows = $('table.changesets tr.changeset');
    this.$holder = $(holder);
  }
}

class Commits {
  constructor(commits_hash) {
    this.commits_by_scmid = commit_hash;
    this.max_rdmid = this.commits().length - 1;
  }

  // 要る?
  commits() {
    return commits_by_scmid.map(val => val)
  }
}

// jquery 依存
function createYforRow($rows, dimension, CIRCLE_INROW_OFFSET) {
  return function (index, commit) {
    const row = $rows.eq(index);

    switch (row.find("td:first").css("vertical-align")) {
      case "middle":
        return row.position().top + (row.height() / 2) - dimension.y_offset;
      default:
        return row.position().top + - dimension.y_offset + CIRCLE_INROW_OFFSET;
    }
  };
}

// jquery 依存
function initDimension($rows, $holder, graph_space, XSTEP) {
  const x_offset   = $rows.first().find('td').first().position().left - $holder.position().left,
  const y_offset   = $holder.position().top,
  const right_side = x_offset + (graph_space + 1) * XSTEP,
  const bottom     = $rows.last().position().top + $rows.last().height() - y_offset;

  return {
    x_offset:   x_offset,
    y_offset:   y_offset,
    right_side: right_side,
    bottom:     bottom
  }
}

// raphael依存
function createPath(graph, x, y, commit, colors, XSTEP, max_rdmid, parent_commit, dimension) {
  const arg  = parent_commit ? getPathArgWithParent(
                                 x,
                                 y,
                                 parent_commit,
                                 yForRow(max_rdmid - parent_commit.rdmid),
                                 xForRow(dimension, XSTEP, parent_commit),
                                 commit.space
                                )
                             : getPathArgWithBottom(
                                 x,
                                 y,
                                 dimension.bottom
                               )
  const path = graph.path(arg);
  path.attr({stroke: colors[commit.space], "stroke-width": 1.5}).toBack();
}

function getPathArgWithParent(x, y, parent_commit, parent_y, parent_x, commit_space) {
  ensureSpace(parent_commit);

  if (parent_commit.space == commit_space) {
    // vertical path
    return [
      'M', x, y,
      'V', parent_y];
  } else {
    // path to a commit in a different branch (Bezier curve)
    return [
      'M', x, y,
      'C', x, y, x, y + (parent_y - y) / 2, x + (parent_x - x) / 2, y + (parent_y - y) / 2,
      'C', x + (parent_x - x) / 2, y + (parent_y - y) / 2, parent_x, parent_y-(parent_y-y)/2, parent_x, parent_y];
  }
}

function getPathArgWithBottom(x, y, bottom) {
  // vertical path ending at the bottom of the revisionGraph
  return [
    'M', x, y,
    'V', bottom];
}

function ensureSpace(commit) {
  if (!commit.hasOwnProperty('space')) {
    commit.space = 0;
  }
}

function xForRow(dimension, XSTEP, parent_commit) {
  return dimension.x_offset + XSTEP / 2 + XSTEP * parent_commit.space;
}

// raphael依存
function initColors(graph_space) {
  const colors = [];
  Raphael.getColor.reset();
  for (let k = 0; k <= graph_space; k++) {
    colors.push(Raphael.getColor());
  }
  return colors
}

// raphael依存
function createCircle(graph, x, y, colors, commit) {
  graph.circle(x, y, 3)
    .attr({
      fill: colors[commit.space],
      stroke: 'none'
     }).toFront();
}

// raphael依存, DOM依存
function createDotOverlay(graph, x, y, commit) {
  const dot = graph.circle(x, y, 10);
  dot.attr({
     fill: '#000',
     opacity: 0,
     cursor: 'pointer',
     href: commit.href
  });
  if(commit.refs != null && commit.refs.length > 0) {
    const title = document.createElementNS(revisionGraph.canvas.namespaceURI, 'title');
    title.appendChild(document.createTextNode(commit.refs));
    dot.node.appendChild(title);
  }
  return dot;
}
