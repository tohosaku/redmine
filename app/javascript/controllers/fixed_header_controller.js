import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="fixed-header"
export default class extends Controller {

  static values  = { section: String };
  static targets = ['main', 'sticky'];

  connect() {
    this.header      = this.mainTarget.querySelector('thead');
    this.bodyColumns = this.mainTarget.querySelectorAll('tbody tr:first-child td');

    this.stickyHeader = this.header.cloneNode(true);
    this.stickyTarget.appendChild(this.stickyHeader);

    this.stickyHeaderColumns = this.stickyHeader.querySelectorAll('tr th');
    this.observe();
  }

  observe() {
    const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        this.sticky = !entry.isIntersecting;
      })
    });

    const resizeObserver = new ResizeObserver(() => {
      this.syncWidth();
    });

    const section = document.getElementById(this.sectionValue);
    if (section === null) return;

    intersectionObserver.observe(section);
    resizeObserver.observe(this.mainTarget);
  }

  set sticky(value) {
    if (value) {
      this.setHeaderSticky();
    } else {
      this.clearHeaderSticky();
    }
  }

  syncWidth(e) {
    this.stickyHeader.style.width = window.getComputedStyle(this.header).width;
    this.bodyColumns.forEach((col, i) => {
      const style = window.getComputedStyle(col);
      if (!col.classList.contains('id') && !col.classList.contains('checkbox')) {
        col.style.width = style.width;
        this.stickyHeaderColumns[i].style.width = style.width;
      }
    });
  }

  setHeaderSticky() {
    this.header.style.visibility = 'hidden';
    this.stickyTarget.style.display = '';
    this.stickyHeader.style.top = '0';
    this.stickyHeader.style.position = 'fixed';
    this.stickyHeader.style.zIndex = '1';
  }

  clearHeaderSticky() {
    this.header.style.visibility = 'visible';
    this.stickyTarget.style.display = 'none';
  }
}
