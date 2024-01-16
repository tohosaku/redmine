import { Controller } from "@hotwired/stimulus"
import { isMobile } from "helper"

// Connects to data-controller="sticky-table-header"
export default class extends Controller {
  static targets = ['head', 'body', 'sticky'];

  connect() {
    this.bodyColumns = this.bodyTarget.querySelectorAll('tr:first-child td');

    this.stickyHeader = this.headTarget.cloneNode(true);
    this.stickyHeader.removeAttribute(`data-${this.identifier}-target`)
    this.stickyTarget.appendChild(this.stickyHeader);
    this.stickyHeaderColumns = this.stickyHeader.querySelectorAll('tr th');

    // get the height of the header on mobile
    const rootStyles = getComputedStyle(document.documentElement);
    this.mobileHeaderHeight = Number.parseInt(rootStyles.getPropertyValue('--mobileheader-height'));
    this.isSticky = false;
    this.setMargin(isMobile())

    this.observe();
  }

  disconnect() {
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  observe() {
    const hrect = this.headTarget.getBoundingClientRect()
    const intersectCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.clearHeaderSticky();
        } else {
          this.syncWidth();
          this.setHeaderSticky(hrect.height)
        }
      })
    }
    const rootMarginTop = this.marginHeight - hrect.height;
    const option = {
      root: null,
      rootMargin: `${rootMarginTop}px 0px 0px 0px`,
      thresholds: 1
    }
    this.intersectionObserver = new IntersectionObserver(intersectCallback, option);

    const resizeCallback = () => {
      this.syncWidth();
    }
    this.resizeObserver = new ResizeObserver(resizeCallback);

    this.intersectionObserver.observe(this.headTarget);
    this.resizeObserver.observe(this.headTarget);
  }

  setMargin(mobile) {
    if (mobile) {
      this.marginHeight = this.mobileHeaderHeight;
    } else {
      this.marginHeight = 0;
    }
  }

  reobserve(e) {
    this.setMargin(e.detail.isMobile)
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.observe()
  }

  syncWidth(e) {
    this.bodyColumns.forEach((col, i) => {
      const style = window.getComputedStyle(col);
      this.stickyHeaderColumns[i].style.width   = style.width;
      this.stickyHeaderColumns[i].style.padding = style.padding;
    });
  }

  setHeaderPosition(e) {
    if (!this.isSticky) return;

    const hrect = this.headTarget.getBoundingClientRect()
    this.stickyHeader.style.top = `${(hrect.top * -1) + 6 + this.marginHeight}px`
  }

  setHeaderSticky(height) {
    this.headTarget.style.visibility = 'hidden';
    this.stickyHeader.style.height   = height + 'px';
    this.stickyTarget.style.display  = '';
    this.isSticky = true;
  }

  clearHeaderSticky() {
    this.headTarget.removeAttribute('style')
    this.stickyHeader.removeAttribute('style')
    this.stickyTarget.style.display  = 'none';
    this.isSticky = false;
  }
}
