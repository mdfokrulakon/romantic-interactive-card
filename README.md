# Romantic Interactive Card

A romantic interactive web card built with HTML, CSS, and JavaScript—featuring floating hearts, cute bear reactions, cycling prompts, a playful dodging **NO** button, optional soft chime audio, and a heart burst when **YES** is clicked.

## Files Included

* `index.html` — Page structure, typography, and layout
* `styles.css` — Romantic pink styling, responsive mobile sizing, and animations
* `script.js` — Custom messages (`CONFIG`), button dodge logic, heart canvas, and Web Audio chime
* `README.md` — Project overview and setup notes

## How to Customize

Open `script.js` and edit the `CONFIG` object at the top to change:

* `eyebrow`, `initialQuestion`, and `initialSubNote`
* `prompts` (the cycling lines and bear badges when **NO** is hovered or tapped)
* `yesTitle`, `yesSubNote`, `loveMessage`, and `signature`

## Hosting on GitHub Pages

1. Keep the repository **Public** so GitHub Pages can publish it on the free tier.
2. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the root of the `main` branch.
3. Go to **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, and save.
4. Once published, open `https://<your-username>.github.io/romantic-interactive-card/`.
