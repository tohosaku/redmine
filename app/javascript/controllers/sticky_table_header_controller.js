import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="sticky-table-header"
export default class extends Controller {
  static targets = ['head', 'body', 'sticky']
  static values = {sticky: Boolean}

  connect() {
    this.bodyColumns = this.bodyTarget.querySelectorAll('tr:first-child td');

    this.stickyHeader = this.headTarget.cloneNode(true);
    this.stickyHeader.removeAttribute(`data-${this.identifier}-target`)
    this.stickyTarget.appendChild(this.stickyHeader);
    this.stickyHeaderColumns = this.stickyHeader.querySelectorAll('tr th');
    this.stickyHeader.style.top = '0';

    if (!this.isIntersecting && !this.isHeaderOverflowX) {
      this.stickyValue = true;
    }

    this.observe();
  }

  disconnect() {
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  observe() {
    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !this.isHeaderOverflowX) {
          this.stickyValue = true;
        }
        if (entry.isIntersecting && !this.isHeaderOverflowX) {
          this.stickyValue = false;
        }
      })
    });

    this.resizeObserver = new ResizeObserver(() => {
      if (!this.isIntersecting && this.isHeaderOverflowX) {
        this.stickyValue = false;
      }
      if (!this.isIntersecting && !this.isHeaderOverflowX) {
        this.stickyValue = true;
      }
      this.syncWidth();
    });

    this.intersectionObserver.observe(this.headTarget);
    this.resizeObserver.observe(this.headTarget);
  }

  syncWidth(e) {
    this.stickyHeader.style.width = window.getComputedStyle(this.headTarget).width;
    this.bodyColumns.forEach((col, i) => {
      const style = window.getComputedStyle(col);
      if (!col.classList.contains('id') && !col.classList.contains('checkbox')) {
        col.style.width = style.width;
        this.stickyHeaderColumns[i].style.width = style.width;
        this.stickyHeaderColumns[i].style.padding = style.padding;
      }
    });
  }

  stickyValueChanged(value) {
    if (value) {
      this.headTarget.style.visibility = 'hidden';
      this.stickyTarget.style.display  = '';
    } else {
      this.headTarget.style.visibility = 'visible';
      this.stickyTarget.style.display  = 'none';
    }
  }

  get isIntersecting() {
    return this.headTarget.getBoundingClientRect().top > 0;
  }

  get isHeaderOverflowX() {
    return this.element.scrollWidth > this.element.clientWidth;
  }
}
