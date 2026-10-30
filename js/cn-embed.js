/* cn-embed.js — drop the live CustomerNode demo into any element.
 *
 *   <div class="cn-embed" data-theme="dark" data-bg="#0b0b10"></div>
 *   <script src="cn-embed.js" defer></script>
 *
 *   data-theme  dark | light   CN panel palette
 *   data-bg     css color      surface behind the frosted-glass panel. MUST
 *                              match the host section or the panel reads grey.
 *   data-scale-max  number     cap on upscaling (default 1.5)
 *
 * The CN panel only reaches its full desktop size at a >=1440px viewport, so
 * cn-demo.html is loaded into a 1440x700 iframe and the region holding the
 * panel + its controls bar (ROI) is cropped and scaled to the container width.
 * The container's height is set from the ROI aspect ratio.
 */
(function () {
  var LOGICAL_W = 1440, LOGICAL_H = 700;   // iframe viewport (desktop layout)
  var ROI_W = 580, ROI_H = 640;            // panel region inside it (see cn-demo.html #stage)
  function mount(el) {
    if (el.__cnMounted) return; el.__cnMounted = true;
    var theme = el.getAttribute('data-theme') || 'dark';
    var bg = el.getAttribute('data-bg') || '';
    var max = parseFloat(el.getAttribute('data-scale-max') || '1.5');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    var f = document.createElement('iframe');
    f.src = 'cn-demo.html?v=6df984ef&theme=' + encodeURIComponent(theme) + (bg ? '&bg=' + encodeURIComponent(bg) : '');
    f.title = 'CustomerNode live product demo';
    f.setAttribute('scrolling', 'no');
    f.setAttribute('tabindex', '-1');
    f.style.cssText = 'position:absolute;left:0;top:0;border:0;background:transparent;transform-origin:0 0;' +
      'width:' + LOGICAL_W + 'px;height:' + LOGICAL_H + 'px;';
    el.appendChild(f);
    function fit() {
      var s = Math.min(el.clientWidth / ROI_W, max);
      f.style.transform = 'scale(' + s + ')';
      f.style.left = Math.round((el.clientWidth - ROI_W * s) / 2) + 'px';
      el.style.height = Math.round(ROI_H * s) + 'px';
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(el); else addEventListener('resize', fit);
  }
  function init() { document.querySelectorAll('.cn-embed').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
