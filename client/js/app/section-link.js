const Clipboard = require('clipboard');

/**
 * Component for section links
 */

class SectionLink {

  constructor() {
    this.content = document.querySelector('.content-wrapper');
    this.headers = this.content.querySelectorAll('h1,h2,h3,h4,h5,h6');
    this.currentHref = window.location.href;
  }

  /**
   * Identify valid section links
   */
  setSectionLinks() {
    Array.prototype.forEach.call(this.headers, (el) => {
      if (el.id) {
        const url = `${this.currentHref}#${el.id}`;
        el.setAttribute('data-clipboard-text', url);
        const clipboard = new Clipboard(el);
        clipboard.on('success', () => {
          alert('Section Link Copied to Clipboard');
        });
      }
    });
  }

  // Init
  init() {
    this.setSectionLinks();
  }
}

export default SectionLink;

