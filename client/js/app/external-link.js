/**
 * Component for external links
 */

class ExternalLink {

  constructor() {
    this.content = document.querySelector('.content-wrapper');
    this.links = this.content.querySelectorAll('a');
    this.currentHost = window.location.host;
    this.linkIcon = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 928v-480q0-26-19-45t-45-19h-480q-42 0-59 39-17 41 14 70l144 144-534 534q-19 19-19 45t19 45l102 102q19 19 45 19t45-19l534-534 144 144q18 19 45 19 12 0 25-5 39-17 39-59zm256-512v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z"/></svg>';
  }

  /**
   * Identify valid external links
   */
  setExternalLinks() {
    Array.prototype.forEach.call(this.links, (el) => {
      // Don't apply to anchors that contain images
      if (0 >= el.getElementsByTagName('img').length) {
        // Don't apply to internal or hash anchors
        if (-1 === el.href.indexOf(this.currentHost) &&
            el.href && -1 === el.href.indexOf('#') &&
            !el.classList.contains('github-button')) {
          el.classList.add('js-external-link');
          el.insertAdjacentHTML('afterend', `<span class="icon-external-link">${this.linkIcon}</span>`);
        }
      }
    });
  }

  // Init
  init() {
    this.setExternalLinks();
  }
}

export default ExternalLink;

