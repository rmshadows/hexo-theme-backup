文件夹名：livemylife

原仓库：https://github.com/V-Vincen/hexo-theme-livemylife

这个仓库是我自己修改的livemylife主题，并不是作者的最新版本。

站点配置参考见 `config_for_theme/`（示例，非主题本体）。

## Log

- 2026.10.15
  - 加密文章：目录不再明文进 HTML；解密后由 `source/js/hbe-toc.js` 从正文生成 TOC
  - Artalk：支持 `enable` / `collapse` / `unlock` / `unlock_hint`；UI 文案用 COMMENTS；折叠或口令通过前不加载 Artalk
  - 首页列表：加密文摘要改用 abstract，避免密文溢出侧栏；`.post-content-preview` 增加断行
  - 页脚：支持站点配置中的 ICP / 公安备案可选展示
- 2022.03.27
  - 修改`source/css/beantech.min.css`，添加`user-select: none`，禁止选择首页标题
- 2020.03.28
  - 更新了主题文件，新增随机动态丝带特效
