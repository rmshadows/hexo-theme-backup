/**
 * After hexo-blog-encrypt decrypts, build TOC from article headings.
 * Pre-decrypt: #toc-div is empty + hidden (no heading leak in HTML).
 */
(function () {
  'use strict';

  function slugify(text) {
    return String(text || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fff\-]+/g, '');
  }

  function ensureHeadingId(h, used) {
    if (h.id) {
      used[h.id] = true;
      return h.id;
    }
    var base = slugify(h.textContent) || 'section';
    var id = base;
    var n = 1;
    while (used[id]) {
      id = base + '-' + n++;
    }
    used[id] = true;
    h.id = id;
    return id;
  }

  function buildToc() {
    var root = document.getElementById('hexo-blog-encrypt');
    var list = document.getElementById('hbe-toc-list');
    if (!root || !list) return false;

    var headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (!headings.length) {
      list.innerHTML = '<li class="toc-item toc-level-1"><span>none</span></li>';
      return true;
    }

    var used = {};
    var html = '';
    headings.forEach(function (h) {
      var level = parseInt(h.tagName.charAt(1), 10);
      var id = ensureHeadingId(h, used);
      var text = (h.textContent || '').trim();
      html +=
        '<li class="toc-item toc-level-' +
        level +
        '">' +
        '<a class="toc-link" href="#' +
        id +
        '">' +
        '<span class="toc-text">' +
        text.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
        '</span></a></li>';
    });
    list.innerHTML = html;
    return true;
  }

  function tryBuild() {
    var root = document.getElementById('hexo-blog-encrypt');
    if (!root) return;
    // Password form still present → not decrypted yet
    if (root.querySelector('.hbe-input-container, #hbePass') || root.querySelector('input[type="password"]')) {
      return;
    }
    if (root.querySelector('h1, h2, h3, h4, h5, h6')) {
      buildToc();
    }
  }

  var root = document.getElementById('hexo-blog-encrypt');
  if (!root) return;

  tryBuild();

  var observer = new MutationObserver(function () {
    tryBuild();
  });
  observer.observe(root, { childList: true, subtree: true });
})();
