# iOS Alarm Chaos Simulator

[简体中文](README.zh-CN.md)

Too few alarms? Cover the whole screen with them.

A pile of iOS-style alarm cards scatters, overlaps, and occasionally loses its composure. Drag cards around, shuffle the layout, switch on auto flicker, or raise the density for an even busier scene. Emoji are gone; the rest of the look and interactions stay as they were.

## How to play

Open [`index.html`](index.html) from the project root in a browser. Drag the cards, hit **Shuffle**, and try auto flicker and the density buttons. Tailwind CSS and Google Fonts load from CDNs, so the first visit needs an internet connection.

## Turn up the noise

Click **Radar** to enable sound. The source is [`audio.mp3`](assets/audio.mp3): a lone alarm plays on its own, while rapid flickers launch overlapping copies for a much louder pileup. Browsers wait for a click on the sound button before allowing playback.

## What lives where

- [`index.html`](index.html): the entrance. Open it and the chaos begins.
- [`styles.css`](styles.css): the page and card looks, plus animations.
- [`js/app.js`](js/app.js): how alarm cards appear, move, and flicker.
- [`js/audio.js`](js/audio.js): sound playback and overlap.
- [`audio.mp3`](assets/audio.mp3): the soundtrack to the commotion.

## Run it with Docker

The included [`Dockerfile`](Dockerfile) and [`compose.yaml`](compose.yaml) serve the page with Nginx. On the Docker CE server, run `docker compose up -d --build` in the project directory, then open `http://SERVER-IP:8080`.

