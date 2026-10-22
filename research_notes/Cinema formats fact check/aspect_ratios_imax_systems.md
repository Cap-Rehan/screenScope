# Cinema aspect ratios and IMAX projection systems

Label key: [MFR] manufacturer/IMAX claim; [IND] independent/secondary; [EST] estimate. Research depth was limited (about 12 tool calls). imax.com returned 403 to fetches.

## What do IMAX's own filings/pages say about 1.43:1 vs 1.90:1 and each system?

### Takeaway
IMAX's FY2025 10-K confirms 1.43 is an "IMAX-exclusive" aspect ratio shown only "in select IMAX locations", and that most movies are remastered into a wider ratio ("up to 26% more image"). It lists Laser, Xenon and Film systems and says Laser comes in "two different configurations", but in the text I could read it never names them or gives 1.90. The system-to-ratio mapping comes mostly from secondary sources.

### Cited Findings
- [MFR] "In select IMAX locations worldwide, movies filmed with IMAX cameras have an IMAX-exclusive 1.43 film aspect ratio". Section: Item 1, IMAX Film Remastering. — [IMAX FY2025 10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)
- [MFR] Same section: remastering projects film "in a larger aspect ratio that delivers up to 26% more image onto a standard IMAX screen" (the 26% matches 1.90 vs 1.43 width/height cropping in 1.85/2.39 content; the 10-K text I read does not state 1.90 itself). — same 10-K
- [MFR] "The Company currently sells or leases two different configurations of the IMAX Laser Systems." The configurations are not described in the text read. Section: IMAX Laser Systems. — same 10-K
- [MFR] Xenon: "no longer offering this system for new signings"; 1,089 Xenon systems at 12/31/2025 vs 1,178 at 12/31/2024. Film systems: 52 at 12/31/2025 vs 44 at 12/31/2024, "52 unique locations", excluded from network and backlog totals because they operate alongside a Laser or Xenon system. Laser in network 757 (2025) vs 607 (2024) per the extracted table, but column headers were unclear, so verify against the filing. Section: IMAX Systems / Xenon / Film. — same 10-K
- [MFR] 1,864 IMAX systems in 91 countries and territories, including 1,796 commercial multiplexes (Item 1, IMAX Network). No breakdown by aspect ratio. — same 10-K
- [MFR] IMAX's Oppenheimer page says IMAX-shot sequences expand to a 1.43:1 aspect ratio "in IMAX theatres featuring 15 perf / 70mm film" (paraphrased via search summary; the page returned 403 to fetch). — [imax.com](https://www.imax.com/md/news/oppenheimer-in-imax-70mm)
- [IND] A Korean fact-check attributes to imax.com that 1.9:1 is the official ratio for standard IMAX. — [Cineplay, 18 Aug 2026](https://www.cineplay.co.kr/en-us/articles/29265)
- [IND] Wikipedia (lead only, unverified): classic IMAX ratio about 1.43:1; IMAX Digital uses a 1.90:1 screen; IMAX with Laser/GT can show 1.43 and also runs on 1.90 screens; xenon 15/70 projectors use 15 kW xenon lamps; original digital used two 2K Christie projectors. Text fetched lacked its reference list. — [Wikipedia: IMAX](https://en.wikipedia.org/wiki/IMAX)

### Inferences
- The 10-K's "select locations" wording plus the "up to 26%" remaster claim implies IMAX itself treats 1.43 as non-universal.

### Gaps
- Did not read the last ~60k characters of the 10-K (offset 200000+) nor the Item 1 text between the two reads in full; a 1.90 or single/dual-projector description may exist there. Recommend a grep of the filing.
- imax.com spec pages (403) not read; no IMAX primary quote on 1.90:1.

## 15/70 frame dimensions: 69.6 x 48.5 vs 70.41 x 52.63 mm

### Takeaway
Two figures circulate. 69.6 x 48.5 mm (2.74 x 1.91 in, ratio about 1.43) is the commonly quoted image/frame size and matches 1.43:1. 70.41 x 52.63 mm (ratio about 1.34) appears in a single post from a film-recorder context. No source I found cleanly labels one "camera" and the other "projected". Treat that labelling as unresolved.

### Cited Findings
- [IND] Wikipedia: IMAX frame 69.6 x 48.5 mm (2.74 x 1.91 in), section Camera > Film cameras; contrast Todd-AO 65mm 48.5 x 22.1 mm. — [Wikipedia: IMAX](https://en.wikipedia.org/wiki/IMAX)
- [IND] Dominic Case (Atlab) forum post: "the frame size is 2.74" x 1.913"" (about 69.6 x 48.6 mm). Jim Houston (Pacific Title Imaging) separately cites "70.41mm x 52.63mm IMAX frame" in a film-recorder resolution discussion. The page does not distinguish camera from projector aperture. — [cinematography.net IMAX 15perf tech specs](https://cinematography.net/edited-pages/IMAX15perf_70mmTechSpecs.htm)
- [IND] A CinemaView page calls 70.41 x 52.63 mm the 15/70 camera frame (65mm negative run horizontally, 15 perfs per frame); Red Shark News rounds the image to 70 x 49 mm. — [CinemaView](https://cinemaview.in/zh-cn/cinema-school), [Red Shark](https://www.redsharknews.com/technology-computing/item/1754-the-staggering-size-and-scale-of-imax)
- [IND] Negative is 65mm, prints are 70mm; extra width carries sound (2.5 mm each side per one forum quote). — cinematography.net page above

### Inferences
- 70.41 x 52.63 (1.338) vs 69.6 x 48.5 (1.435): the larger height likely reflects the full 15-perf pitch or a camera-gate figure, while 48.5 mm matches the 1.43 projected image. This is my inference, not sourced. Verify against SMPTE 15/70 standards or the IMAX camera spec.

### Gaps
- No primary (IMAX/SMPTE/Kodak) document found for either number.

## Which systems present 1.43:1, and how many screens?

### Takeaway
Only 15/70 film projection and dual-projector 4K laser (GT) on a 1.43 screen present full 1.43:1. Single-projector laser (CoLa/XT) and Xenon digital are 1.90:1. Counts are secondary: about 41 locations with a 1.43 screen plus film projector, and about 20 GT laser 1.43 screens, i.e. roughly 60 total (estimate, unsourced to IMAX).

### Cited Findings
- [IND] Engadget (Husain Parvez, 27 Aug 2026): 15/70 film fills 1.43; GT Laser (dual 4K) can project 1.43 in suitably equipped theaters; CoLa and XT single-projector laser typically max 1.90:1; Xenon is older dual 2K from 2008; some venues have film plus laser/xenon on one screen; IMAX's theater finder does not detail projector setup; Dolby Cinema cannot duplicate 1.43. No count given. — [Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/)
- [EST] "41 screens capable of the true IMAX 70mm presentation, and around 20 or so IMAX GT Dual Laser screens" capable of 1.43; other formats crop. No cited source. — [Dark Horizons, 18 Jul 2026](https://www.darkhorizons.com/?p=193391)
- [EST] "only 41 locations have both a 1.43-to-1 screen and a film projector"; chart captioned "Captured from the IMAX SEC report" but the figure is not tied to a filing in the text. — [Cineplay](https://www.cineplay.co.kr/en-us/articles/29265)
- [IND] 10-K film-system count is 52 locations at 12/31/2025, which differs from 41 (the 10-K figure counts film systems, not necessarily 1.43 screens; the two numbers are not reconciled). — [10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)
- [IND] 2023: about 30 IMAX 70mm venues for Oppenheimer. — [YMCinema](https://ymcinema.com/2023/06/05/oppenheimer-imax-70mm-screening-at-only-30-theaters-worldwide/)
- [IND] UK has exactly three full 1.43 GT venues despite dozens of IMAX-branded screens. — [CinemaView UK guide](https://cinemaview.in/es/blog/uk-imax-70mm-gt-cinemas-guide)
- [IND] Single-projector laser appeared from 2018. — Engadget / CinemaView ([Laser vs Xenon](https://cinemaview.in/blog/imax-laser-vs-xenon))

### Inferences
- The 10-K Laser total (757) cannot be split into GT vs single-projector from what I read; the "two configurations" sentence suggests both counted together.

### Gaps
- No IMAX investor-slide figure for 1.43-capable screens found; the 41/20 numbers are unverified third-party claims. The ymcinema Oppenheimer large-format guide and in70mm.com lists were not fetched.

## Does "IMAX" automatically mean 1.43:1?

### Takeaway
No. Most IMAX-branded screens (Xenon and single-projector laser) are 1.90:1 and show 1.43 content only as cropped/expanded 1.90; 1.43 requires a taller screen plus film or dual laser.

### Cited Findings
- [MFR] 1.43 is "IMAX-exclusive" and only "in select IMAX locations"; 1,864 systems total. — [10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)
- [IND] UK: 3 full 1.43 venues among dozens of IMAX-branded; "LieMAX has no technical specification"; IMAX does not state projector setup in its finder. — [Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/), [CinemaView](https://cinemaview.in/es/blog/uk-imax-70mm-gt-cinemas-guide)
- [IND] Wikipedia note: fewer than a quarter of 1,305 systems (late 2017) could show 70mm film. — [Wikipedia](https://en.wikipedia.org/wiki/IMAX)
- [MFR] Q2 2026 release: The Odyssey shot entirely with IMAX film cameras; $52M opening weekend (no ratio detail seen). — [IMAX Q2 2026 8-K](https://www.sec.gov/Archives/edgar/data/0000921582/000162828026049290/imax-q22026epr.htm)

### Inferences
- A 2.39 film in standard IMAX is shown about 1.90:1 with top/bottom bars on 1.90 screens; on 1.43 screens it would be letterboxed more (not sourced; basic geometry).

### Gaps
- 2.39:1, 1.85:1 handling and "IMAX Enhanced" (a home-video DTS/IMAX certification, expanded-ratio 1.90 on Disney+ etc.) were not researched or sourced; not covered here.
- Kodak, Christie, Barco, theasc.com not consulted.
