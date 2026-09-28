# iOS 闹钟混乱模拟器

[English](README.md)

闹钟太少？那就让它们铺满屏幕。

一堆 iOS 风格闹钟卡片随机散落、互相压住，还会时不时集体抽风。你可以拖卡片、重排布局、开关自动疯闪，或者继续加闹钟，把场面弄得更热闹。表情符号已经清理干净，其他视觉效果和交互照旧。

## 怎么玩

用浏览器打开项目根目录里的 [`index.html`](index.html)。拖动卡片、点「重排布局」，再试试自动疯闪和密度按钮。项目通过 CDN 加载 Tailwind CSS 和 Google Fonts，首次打开需要联网。

## 声音也来凑热闹

点一下 **Radar** 开启铃声。音源就是旁边的 [`audio.mp3`](assets/audio.mp3)：单个闹钟响起来很简单，卡片疯闪时多个播放会叠在一起，越闪越热闹。浏览器会等你先点一下铃声按钮，才允许播放。

## 文件都在哪

- [`index.html`](index.html)：入口，打开它就开场。
- [`styles.css`](styles.css)：卡片和页面的造型、动画。
- [`js/app.js`](js/app.js)：闹钟卡片怎么出现、怎么动、怎么闪。
- [`js/audio.js`](js/audio.js)：铃声播放和声音叠加。
- [`audio.mp3`](assets/audio.mp3)：本场混乱的伴奏。

## 用 Docker 启动

项目附带 [`Dockerfile`](Dockerfile) 和 [`compose.yaml`](compose.yaml)，使用 Nginx 提供页面。在 Docker CE 服务器的项目目录中运行 `docker compose up -d --build`，然后访问 `http://服务器IP:8080`。

