# For You

A small, romantic interactive card built with HTML, CSS, and JavaScript—featuring gentle floating hearts, cute bear reactions, cycling prompts, a playful dodging **NO** button, optional soft chime audio, and a heart burst when **YES** is clicked.

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

1. Create a **Public** repository named `for-you` on GitHub.
2. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the root of the `main` branch.
3. Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. Once published, share `https://<your-username>.github.io/for-you/`.
