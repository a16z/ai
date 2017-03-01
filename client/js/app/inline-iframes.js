export default function () {
  const iframes = document.getElementsByTagName('iframe');

  if (iframes) {
    Array.prototype.forEach.call(iframes, (el) => {
      el.onload = function () { // eslint-disable-line
        const iframe = el.contentWindow.document;
        const loadHeight = iframe.body.scrollHeight;
        el.height = `${loadHeight}px`; // eslint-disable-line

        iframe.addEventListener('click', (e) => {
          if (e.target && (e.target.matches('input[type="submit"]') ||
            e.target.matches('img.pickerImage') ||
            e.target.matches('span.hoverArea'))) {
            const self = this;
            setTimeout(() => {
              const newHeight =
                self.contentWindow.document.body.scrollHeight + 50;
              self.height = `${newHeight}px`;
            }, 500);
          }
        });
      };
    });
  }
}
