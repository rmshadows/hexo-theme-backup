/**
 * Override hexo-generator-zip-search: encrypted posts keep title (+ url) only.
 *
 * Leak path (fixed):
 *   hexo generate
 *     → hexo-generator-zip-search reads post._content (raw Markdown, pre-encrypt)
 *     → packs into public/search.flv → search.json
 *     → every page loads /rmshadows/search.flv for站内搜索
 */
'use strict';

const fs = require('fs');
const archiver = require('archiver');

function isEncryptedPost(post, tagPasswordMap) {
  if (post.password != null && String(post.password).length > 0) {
    return true;
  }
  if (!post.tags || !tagPasswordMap) return false;
  let hit = false;
  post.tags.each(function (tag) {
    if (tagPasswordMap[tag.name]) hit = true;
  });
  return hit;
}

function buildTagPasswordMap(config) {
  const map = Object.create(null);
  const tags = (config.encrypt && config.encrypt.tags) || [];
  tags.forEach(function (t) {
    if (t && t.name && t.password) map[t.name] = true;
  });
  return map;
}

hexo.extend.generator.register('zip', function (locals) {
  const config = this.config;
  const searchConfig = config.search;
  const searchfield = (searchConfig.field || '').trim();
  const tagPasswordMap = buildTagPasswordMap(config);
  const log = this.log;
  const publicDir = this.public_dir;

  let posts;
  let pages;
  if (searchfield === 'post') {
    posts = locals.posts.sort('-date');
  } else if (searchfield === 'page') {
    pages = locals.pages;
  } else if (searchfield !== '') {
    posts = locals.posts.sort('-date');
    pages = locals.pages;
  } else {
    posts = locals.posts.sort('-date');
  }

  const res = [];
  let encryptedCount = 0;

  function pushItem(item, encrypted) {
    const row = {};
    if (item.title) row.title = item.title;
    if (item.path) row.url = config.root + item.path;
    if (encrypted) {
      encryptedCount += 1;
      row.content = '';
    } else if (item._content) {
      row.content = item._content;
    } else {
      row.content = '';
    }
    if (item.tags && item.tags.length > 0) {
      const tags = [];
      item.tags.each(function (tag) {
        tags.push(tag.name);
      });
      row.tags = tags;
    }
    if (item.categories && item.categories.length > 0) {
      const categories = [];
      item.categories.each(function (cate) {
        categories.push(cate.name);
      });
      row.categories = categories;
    }
    if (item['header-img']) row.header_img = item['header-img'];
    if (item.date) row.date = item.date;
    res.push(row);
  }

  if (posts) {
    posts.each(function (post) {
      pushItem(post, isEncryptedPost(post, tagPasswordMap));
    });
  }
  if (pages) {
    pages.each(function (page) {
      pushItem(page, isEncryptedPost(page, tagPasswordMap));
    });
  }

  const json = JSON.stringify(res);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Wait for archive close so search.flv has a valid CRC before generate finishes
  return new Promise(function (resolve, reject) {
    const output = fs.createWriteStream(publicDir + searchConfig.zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', function () {
      log.info(
        'secure-zip-search: %s (%d encrypted → title only)',
        searchConfig.zipPath,
        encryptedCount
      );
      resolve({
        path: searchConfig.versionPath,
        data: String(+new Date()),
      });
    });
    archive.on('error', reject);
    output.on('error', reject);

    archive.pipe(output);
    archive.append(json, { name: searchConfig.path });
    archive.finalize();
  });
});
