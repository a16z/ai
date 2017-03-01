export default function () {
  const iframes = document.getElementsByTagName('iframe');

  if (iframes) {
    Array.prototype.forEach.call(iframes, (el) => {
      el.onload = function () { // eslint-disable-line
        const iframe = el.contentWindow.document;
        iframe.addEventListener('click', (e) => {
          if (e.target && e.target.matches('input[type="submit"]')) {
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
