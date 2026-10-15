文件夹名：`livemylife`

原仓库：https://github.com/V-Vincen/hexo-theme-livemylife

这个仓库是我自己修改的 livemylife 主题，并不是作者的最新版本。

站点 Hexo 配置示例见 `config_for_theme/_config.yml`（**示例，不是主题本体**；部署时改成你自己的 `url` / Artalk / 备案号等）。

## 部署

1. 准备 Hexo 站点（已有可跳过）：

```bash
npm install -g hexo-cli
hexo init your-blog && cd your-blog
npm install
```

2. 安装本主题到站点：

```bash
# 推荐：作为 themes/livemylife
git clone https://github.com/rmshadows/hexo-theme-backup.git themes/livemylife
# 或把本仓库内容拷到 themes/livemylife/
```

3. 站点根目录 `_config.yml`：

```yml
theme: livemylife
```

并把 `config_for_theme/_config.yml` 里与主题相关的段合并进你的站点配置（至少包括 `artalk` / `icp` / `gongan` / `encrypt` 等你要用的项）。**不要**直接整文件覆盖，除非你清楚差异。

4. 若使用文章加密，需安装插件：

```bash
npm install --save hexo-blog-encrypt
```

文章 front-matter 设置非空 `password` 即可；加密文目录依赖主题内 `source/js/hbe-toc.js`。

若站点使用 `hexo-generator-zip-search`：该插件会把**未加密的 Markdown 原文**打进 `search.flv`，从而绕过博文加密。请把本仓库 `extras/secure-zip-search.js` 复制到站点的 `scripts/` 目录（会覆盖同名 `zip` generator，加密文只索引标题）。

5. 本地预览 / 生成：

```bash
hexo clean && hexo generate
hexo server   # http://localhost:4000
```

6. 按你自己的方式部署 `public/`（GitHub Pages、`hexo deploy`、rsync 到服务器等）。

### 本主题新增配置速查

| 配置 | 作用 |
|------|------|
| `icp.enable` / `icp.number` | 页脚 ICP |
| `gongan.enable` / `number` / `code` / `icon` | 页脚公安备案 |
| `artalk.enable` | 是否启用 COMMENTS |
| `artalk.collapse` | 默认折叠，点击后再加载 Artalk |
| `artalk.unlock` | 非空则需输入该字符串再展开 |
| `artalk.unlock_hint` | 可选提示词（空则不显示） |

单篇可覆盖：`artalk: false`、`artalk_collapse`、`artalk_unlock`、`artalk_unlock_hint`。

## Log

- 2026.10.15（续）
  - 补充 `extras/secure-zip-search.js`：配合 zip-search 时加密文只进标题，避免 `search.flv` 泄漏正文
  - 再次同步主题文件；示例配置保持占位符，不含个人隐私
- 2026.10.15
  - 加密文章：目录不再明文进 HTML；解密后由 `source/js/hbe-toc.js` 从正文生成 TOC
  - Artalk：支持 `enable` / `collapse` / `unlock` / `unlock_hint`；UI 文案用 COMMENTS；折叠或口令通过前不加载 Artalk
  - 首页列表：加密文摘要改用 abstract，避免密文溢出侧栏；`.post-content-preview` 增加断行
  - 页脚：支持站点配置中的 ICP / 公安备案可选展示
  - 更新 `config_for_theme` 示例与本 README 部署说明
- 2022.03.27
  - 修改`source/css/beantech.min.css`，添加`user-select: none`，禁止选择首页标题
- 2020.03.28
  - 更新了主题文件，新增随机动态丝带特效
