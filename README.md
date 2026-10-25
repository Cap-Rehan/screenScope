# ScreenScope

**Are you actually seeing the whole movie?**

ScreenScope is a single-page, scroll-driven guide to cinema formats: aspect ratios, what "IMAX" really covers, resolution, brightness, colour, sound and screen size. One 3D auditorium, with a glowing screen at its centre, follows you down the page and changes with every demo.

**Live:** https://cap-rehan.github.io/screenScope/

## What's inside

| Section | What you can do |
|---|---|
| The frame | Scroll through 2.39, 1.90 and 1.43 crops of one tall photo, see letterboxing, frame lines for films composed for several versions, and sequences that expand mid-film |
| IMAX systems | Switch between 15/70 film, dual and single laser, and xenon digital; see the 15-perf and 5-perf 70mm frames drawn to scale |
| Real films | Watch official IMAX videos (loaded only when you press play) |
| Pixels | Fly up to the screen until the photo's pixels show; work out pixels per degree from your seat; read a "K" figure off Kodak's measured film curves |
| Brightness and contrast | Compare the cinema standard's 11–17 fL range with manufacturer claims; sequential vs in-frame contrast |
| Colour | Colour-filled CIE chart with Rec. 709, DCI-P3, Rec. 2020 and your own screen's gamut; click any colour to see which systems can show it |
| Sound | Hear channels vs objects through virtual speakers around your head (headphones recommended), with a fly-by |
| Scale | Real screens, from Leonberg's record 38.8 m wall down, beside a 1.8 m person |
| Formats | Six systems side by side, plus a checklist for booking |

## Accuracy

The content comes from the research in [`reports/`](reports/) and [`research_notes/`](research_notes/). Every figure on the page carries a small mark saying what backs it: industry standard, SEC filing, manufacturer claim, independent source, or our own arithmetic. The marks link to the sources section, which also lists what couldn't be verified. Marketing figures such as "70mm = 16K" or "1,000,000:1 contrast" are presented as claims, not facts.

## Running it

Requires Node 20 or later.

```bash
npm install
npm run dev       # local dev server
npm run check     # type-check and unit tests
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## How it's built

- **React 19, TypeScript, Vite** for the page; **Tailwind CSS 4** for styling.
- **three.js via React Three Fiber** for the single 3D auditorium (`src/scene/`). It is procedural: no model files.
- **GSAP ScrollTrigger** for scroll progress; the camera moves between per-section shots.
- **Web Audio API** for the sound demo; nothing plays until you press play.
- The maths behind the demos (crops, pixels per degree, film MTF, speaker gains, gamut tests) lives in `src/lib/` with unit tests in `src/lib/lib.test.ts`.

```
src/
  sections/   one file per part of the page
  scene/      the 3D stage and its camera shots
  lib/        demo maths, audio, colour, hooks
  content/    sources and evidence labels
  components/ shared UI
```

The page works without WebGL (an HTML screen stands in) and respects reduced-motion settings.

## Your own film stills

Film stills are usually copyrighted, so none are included. To try the aspect-ratio demo with your own frame, save it as `public/stills/master.jpg` (about 1.43:1). That folder is gitignored; see [`public/stills/README.md`](public/stills/README.md).

## Credits

- Launch photo: NASA/Joel Kowsky, Artemis I, 16 Nov 2022 (public domain).
- Film curves: digitised from Kodak's VISION3 500T 5219 technical brochure.
- Colour data: CIE 1931 2° colour matching functions via CVRL.
- Videos: embedded from IMAX's official YouTube channel.
- Fonts: Big Shoulders Display and Atkinson Hyperlegible Next (SIL Open Font License).

IMAX, Dolby Cinema and Dolby Atmos are trademarks of their owners. ScreenScope is independent and not affiliated with either company.
