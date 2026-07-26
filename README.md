# Happy Birthday My Cutu Baby ❤️

A cinematic, single-page birthday surprise website built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Run it

Just open `index.html` in a browser, or deploy the whole `birthday-surprise/` folder to GitHub Pages / Netlify / Vercel as a static site.

```
birthday-surprise/
├── index.html
├── css/
│   ├── main.css          # layout, components, color tokens
│   ├── animations.css    # keyframes
│   └── responsive.css    # breakpoints
├── js/
│   ├── app.js             # site logic & interactions
│   └── animations.js      # particle / canvas effects
├── assets/
│   ├── images/            # your own photos
│   ├── music/              # background song
│   └── videos/             # birthday video
└── README.md
```

## Add your own content

**Photos** — the gallery currently loads 12 placeholder photos from picsum.photos so the page works out of the box. To use your own photos:
1. Drop 12+ images into `assets/images/`.
2. In `js/app.js`, find the `galleryCaptions` loop and change the `img.src` line to point at your files, e.g. `assets/images/photo-1.jpg`.

**Music** — add an MP3 to `assets/music/background-song.mp3` (the player already looks for this file). Update the song title in `index.html` inside `.music-song-name`.

**Video** — add your video to `assets/videos/birthday-surprise.mp4` and an optional poster image at `assets/images/video-poster.jpg`.

**The letter** — edit the `letterLines` array near the top of `js/app.js` to change the wording of the typewriter letter.

**The name / signature** — search for "Chandra" in `index.html` and `js/app.js` to update the signature.

**Colors & fonts** — all design tokens live at the top of `css/main.css` under `:root`.

## Notes on browser autoplay

Browsers block audio/video autoplay without a user gesture, so the site shows a "Tap to begin" gate after loading. Music starts as soon as the person taps it.

## Accessibility

- Semantic landmarks and heading structure throughout.
- All interactive elements (gift box, envelope, buttons) are keyboard-operable and have `aria-label`s.
- Respects `prefers-reduced-motion` by shortening/removing animations.
- Alt text on all images.

## Performance

- Images use `loading="lazy"`.
- All animations use `transform`/`opacity` only — no layout-thrashing properties.
- Particle systems clean up their DOM nodes after use.
