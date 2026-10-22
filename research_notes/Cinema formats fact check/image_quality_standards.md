# Cinema image-quality metrics and standards (as of Oct 2026)

Labels: [STD] = standard text read directly; [MFR] = manufacturer claim; [INDEP] = independent/third-party; [SEC] = secondary reporting (not verified against primary); [EST] = my estimate.

## 1. What do SMPTE ST 431-1 / RP 431-2 and DCI v1.x actually require (luminance, tolerance, contrast, gamut)?

### Takeaway
The 14 fL / 48 cd/m2 figure is a nominal screen-centre value for 100% white, measured at the screen, with a commercial-theatre tolerance of +/-3 fL (so roughly 11-17 fL passes). DCI v1.3 delegates all projector/environment parameters to SMPTE RP 431-2 (its own tables are blank). The commonly quoted "1200:1 sequential / 100:1 intra-frame" minimums come only from secondary sources here; I could not read RP 431-2 itself (paywalled/unfetchable).

### Cited Findings
- [STD] ST 431-1:2006 section 1 Scope: specifies "absolute luminance level, white point chromaticity, and luminance uniformity of the reflected screen light"; it does NOT specify contrast. — [SMPTE ST 431-1:2006 PDF](https://pub.smpte.org/doc/st431-1/20060418-pub/st0431-1-2006.pdf)
- [STD] ST 431-1 s3: two classes, "Review Room" (highest precision, mastering) and "Theater" ("minimum level for commercial cinema presentations"). — same PDF
- [STD] ST 431-1 s4.1: measured with 100% white displayed, lens at optimal focus. s4.2: locations = screen centre and four sides in theaters (plus four corners in review rooms), side/corner points inset 5% +/-1% of screen width. s4.3: measured at the centre of the seating row closest to the geometric centre of the seating area, ~1.1 m above floor. s4.4: spot photometer, acceptance angle 2 deg or less, accuracy +/-0.5 cd/m2 (+/-0.2 fL), integrates at >=24 Hz. s4.5 chromaticity meter accuracy +/-0.002 x,y. — same PDF
- [STD] ST 431-1 s5.1: "The nominal value for screen luminance is 48.0 cd/m2 (14.0 fL)." Table 1: Review room +/-3.5 cd/m2 (+/-1.00 fL); Theater +/-10.2 cd/m2 (+/-3.00 fL). So theater range is ~37.8-58.2 cd/m2 (11-17 fL). — same PDF, Table 1 p3
- [STD] ST 431-1 s5.2/Table 1: side luminance 85% of centre nominal; theater 75-90% of centre; review room 80-90%; corners not specified for theater. s5.3: white point x=0.314, y=0.351, theater tolerance +/-0.006 x, +/-0.006 y (review room +/-0.002). — same PDF
- [STD] ST 431-1 Annex A.2 (informative): "Users are reminded that screen luminance decreases as a function of bulb age, dirt on optics, dirt on the screen." A.3: light output may be reduced for more light-efficient formats. A.6: standard measures the installed system (projector+room+screen), not the projector alone. — same PDF
- [STD] DCI System Specification v1.3 (27 Jun 2018) s8.2.2.6 "Pixel Count": projector pixel count "required to be equal to or greater than" the image container (4096x2160 or 2048x1080). s8.2.2.7: projector must display native 4096x2160 or 2048x1080; 2K content up-converted on exact 2:1 ratio. — [DCI v1.3 (third-party mirror; I could not reach dcimovies.com PDF)](https://source.netsyms.com/skylarmt/glenwing.github.io_withhdmi/raw/branch/master/docs/DCI-1.3.pdf), PDF p75
- [STD] DCI v1.3 s8.3.3 "Environment, Image Parameters and Projected Image Tolerances": "The SMPTE published recommended practice [SMPTE RP 431-2] shall be utilized and shall be normative in its entirety"; Tables 11-14 are "Left Blank Intentionally". Text search of the whole v1.3 PDF found no "1200", "2000:1", "150:1", "48 cd" or "contrast" numbers. — same mirror, PDF p75
- [SEC] RP 431-2 reference projector: nominal sequential contrast 2000:1, minimum 1200:1 for cinemas; nominal intra-frame (ANSI-like) 150:1, minimum 100:1; reference white 48 nits. Cinepedia states these are for standard cinema, not HDR. — [Cinepedia](https://cinepedia.com/picture/image-contrast-dynamic-range-and-high-dynamic-range/). Patents attribute sequential contrast to DCI v1.1 s8.3.4.7 (April 2007) (from search snippet only, unverified).
- [STD] Gamut: SMPTE ST 2113:2018 Table 1 P3 primaries R (0.6800,0.3200), G (0.2650,0.6900), B (0.1500,0.0600) "same as in SMPTE RP 431-2"; P3DCI white (0.3140,0.3510); P3D65 white (0.3127,0.3290); P3D60 (0.32168,0.33767). — [SMPTE ST 2113:2018](https://pub.smpte.org/pub/st2113/st2113-2018.pdf) s5.1, s6.2-6.4 (blue primary read from secondary search summary, not the PDF text)
- [STD] Konica Minolta app note on measuring ST 431-1 (instrument vendor, useful for method): [PDF](https://sensing.konicaminolta.asia/wp-content/uploads/2018/07/Digital_cinema_screen_luminance_measurement.pdf) (not read in full)
- [SEC] DCI later versions: v1.4 (20 Jul 2020), v1.4.1 (13 Oct 2021), per Wikipedia. — [Wikipedia](https://en.wikipedia.org/wiki/Digital_Cinema_Initiatives). I did not read v1.4+ for any HDR requirement.

### Inferences
- "14 fL" is a tolerance band, not a floor; an auditorium at 11 fL is compliant. Many marketing comparisons ("DCI 14 fL vs our 22 fL") ignore that 14 fL is nominal and measured on screen with 3D/format-specific adjustments allowed (Annex A.3).
- Strictly, ST 431-1 has no contrast clause; contrast sits in RP 431-2 (not verified from primary).

### Gaps
- Primary text of SMPTE RP 431-2:2011 (sequential/intra-frame contrast clauses, section numbers) not obtained; pub.smpte.org link returned a non-PDF. Need full text to quote clause numbers.
- dcimovies.com official PDF not reachable (returned HTML); used a third-party mirror. DCI v1.4/1.4.1 text not checked.

## 2. Do Christie / Barco / NEC / Dolby / IMAX spec sheets state resolution, contrast, brightness?

### Takeaway
Manufacturer contrast numbers are native/sequential on-off, quoted with best-case lens options; Barco is the one source that also publishes an ANSI figure (500:1), which is far below the sequential number. IMAX's only primary-ish contrast/brightness numbers are a 2018 CTO interview (22 fL, >10,000:1 sequential). Dolby publishes no contrast number in what I found; 1,000,000:1 is press-repeated.

### Cited Findings
- [MFR] Christie CP4325-RGB (end of production, replaced by CP4330-RGB 31 Aug 2019): "up to 25,000 lumens" (existing high-brightness lens), "up to 6000:1" contrast (footnote: with new UHC cinema lenses), >90% Rec.2020 coverage, >30,000 h to 80% brightness. — [Christie datasheet PDF](https://christiedigital.com/globalassets/resources/public/christie-cp4325-rgb-datasheet.pdf); product page lists >95% Rec.2020 [Christie page](https://www.christiedigital.com/products/end-of-production/cinema-projectors/christie-cp4325-rgb/) (two Christie pages disagree: >90% vs >95%)
- [MFR] Barco DP4K-60L: "up to 56,000 lumens"; "Native contrast ratio 2,800:1 (typical) / 500:1 ANSI contrast (typical)"; native 4096x2160 (resolution per search summary); 6P laser 3D. — [Barco spec sheet (Spanish)](https://assets.barco.com/m/75224f028c2f9d4b/original/DP4K-60L-es-Spec-sheet.pdf) (text extracted locally). A third-party database cites 2350:1 (not authoritative).
- [MFR/SEC] Christie CP4450-RGB: up to 55,000 DCI lumens, 4K 120 Hz, "greater than 95% of Rec.2020" (product-line statement); contrast not found. — [BoxOfficePro](https://www.boxofficepro.com/christie-introduces-cp4450-rgb-direct-coupled-rgb-pure-laser-projector-for-plf-theaters/), [Christie projection page](https://www.christiedigital.com/products/cinema/projection)
- [MFR] IMAX CTO Brian Bonnick, CinemaCon-2018 launch of single-projector laser: "We have improved the contrast to over 10,000:1 sequential"; "Brightness remains about the same - 22 fL (75 cd/m2) in 2D or 3D"; 4K, prism-less 3-DMD, single projector with dual-lens design for >80 ft screens, 1.43:1; intra-frame contrast improved but no figure. — [Display Daily, 2 May 2018](https://displaydaily.com/imax-upgrades-laser-projector/)
- [MFR/SEC] Original dual-4K-projector IMAX laser: two 4K projectors with sub-pixel alignment giving "perceived" greater-than-4K resolution (reporter's wording, not a native spec). — [What Hi-Fi](https://www.whathifi.com/news/imax-launches-laser-projection-system-in-uk-and-it-looks-spectacular)
- [SEC] Dolby Cinema/Dolby Vision: press reports ~31 fL 2D / 14 fL 3D (Christie exec quote), "108 nits" or "106 nits" peak (venue/guide, not Dolby), 1,000,000:1 contrast (press; one source says Dolby did not state a contrast level), two Christie 4K laser heads. Wikipedia cites 7,500:1 measured by the DCI method for Dolby Vision-graded films (not verified). — [TechRadar](https://www.techradar.com/news/video/dolby-just-opened-the-most-advanced-cinema-in-the-world-1299524), [Ravepubs](https://www.ravepubs.com/dolby-selects-christie-co-develop-dolby-vision-projection-systems-dolby-cinema)
- NEC: no NEC spec sheet retrieved (searches did not surface it).

### Inferences
- The Christie 6000:1 and Barco 2800:1 vs 500:1 ANSI pairing shows manufacturers' headline numbers are sequential full-on/full-off; real in-auditorium contrast is lower (see section 3).
- IMAX's 22 fL and ">10,000:1" are single-person interview claims, repeated unchanged in press since 2016/2018; no spec sheet or measurement found.

### Gaps
- No Dolby primary spec/white paper with peak nits and contrast; no NEC spec; no Christie contrast for CP4450-RGB; no IMAX-published spec sheet.

## 3. Independent measurements of contrast/brightness in real auditoriums

### Takeaway
Little independent field data exists in the open literature I reached. The best item is a Dolby (not independent) model validated on five Dolby Vision venues showing contrast collapses with picture content and veiling glare.

### Cited Findings
- [MFR research, Dolby] Marty Richards (Dolby), 31 Oct 2017, reported by Display Daily: contrast model with projector peak luminance, dark luminance and level-dependent dark luminance (veiling glare); measured five Dolby Vision venues; below 1% APL contrast limited by ambient dark luminance; venue variation attributed to dirty optics/port glass and room light; at 10% APL achievable contrast ~100:1, 1800:1 and 2500:1 for three configurations compared across nine movies; audience reflections can cut contrast up to ~25%. — [Display Daily](https://displaydaily.com/?p=56076)
- [INDEP-ish, DCI] DCI double-blind HDR tests (24 sessions, late 2017, RGB laser at Disney; 2020 Sony CLED peak tests, 157 participants): "black levels of 0.005 cd/m2 are enough to give a compelling HDR experience"; peaks >100 cd/m2 preferred; step up at >=300 cd/m2; 300/500/800 rated about the same; DCI to make 300 cd/m2 the HDR display requirement. 60,000:1 is the article author's arithmetic, not a DCI statement. — [Display Daily](https://displaydaily.com/dci-explains-and-decides-what-hdr-is-in-cinemas/)
- [INDEP, anecdotal] Film-Tech forum 2001 thread: user-measured screens 16-22 fL (analog era, not a survey). — [Film-Tech](https://www.film-tech.com/ubb/f1/t002457.html)
- [SEC] One press item says typical cinemas average 3.5-6 fL and a London laser cinema 12 fL; unnamed source, unverified. — surfaced via search; treat as unreliable.
- ASC Cinema Display Evaluation Plan & Test Protocol (2016) defines a visual evaluation method for deeper blacks, wider primaries, contrast and peak white; no measured results found. — [ASC](https://theasc.com/report/asc-display-evaluation-plan-test-protocol/)

### Inferences
- Because ST 431-1 measures white on screen only, a theatre can pass luminance while delivering low on-screen contrast from spill/glare; Dolby's own data supports this.

### Gaps
- No peer-reviewed or CAS/Cinema Technology survey of on-screen contrast across many auditoriums found. No independent measurement of IMAX laser 22 fL or Dolby 31 fL.

## 4. 70mm / 15/70 resolution: Kodak/ASC/independent; is "16K" substantiated; exact IMAX 14K-16K wording

### Takeaway
Film has no pixels; Kodak publishes sharpness as MTF curves (response vs cycles/mm), not as a K number. IMAX's "14K-16K per colour" is reported second-hand from an IMAX behind-the-scenes video on The Odyssey; I found no independent MTF measurement supporting any K figure for 15/70.

### Cited Findings
- [SEC] Claim: IMAX says each 15/70 frame holds "roughly 14K to 16K of resolution" described as "per color". Source = IMAX behind-the-scenes video for The Odyssey; speaker not named; article dated 7 Jul 2026; YMCinema could not give IMAX's full sentence and itself notes film is analog, so not a 1:1 equal of a 16K RGB file, and usable resolution depends on stock, lens, focus, exposure, processing, scanning, grain, projection. — [YMCinema 7 Jul 2026](https://ymcinema.com/2026/07/07/imax-odyssey-16k-per-color/). Another outlet reports "14K-18K per colour layer" (IMAX engineers, unattributed). — [Mezha](https://mezha.ua/en/articles/imax-70mm-313942/). Original IMAX video not located.
- [SEC] Older claims: "up to 16K" attributed to IMAX Melbourne ("often reported"); IMAX "approximately 12,000 lines (6,000 line pair)" 12K; 18K claim for Oppenheimer. — [YMCinema 2022](https://ymcinema.com/2022/10/12/imax-1570-film-vs-imax-laser-digital/), [YMCinema 2023](https://ymcinema.com/2023/01/27/nolans-oppenheimer-imax-15-70-and-18k-resolution/)
- [INDEP, practitioner opinion] American Cinematographer-list thread: Dominic Case (Atlab): film has no pixels; 15-perf frame ~2.7x area of 35mm open gate; matching a 4Kx3K 35mm scan needs ~10Kx8K. Jim Houston (Pacific Title): recorder spot sizes 6 / 12 micron, 70.41x52.63 mm at 11,753x8,772 or 5,868x4,386; sharpened 4096x3062 looks good. Tim Sassoon: gains above ~4Kx3K limited by recorder spot size. Frame dimensions in the thread conflict (69.6x48.6 vs 70.41x52.63 mm). — [cinematography.net thread](https://cinematography.net/edited-pages/IMAX15perf_70mmTechSpecs.htm) (undated)
- [MFR] Kodak VISION3 500T 5219/7219 brochure plots "Spatial Frequency" (sine waves/mm) vs "Response" (MTF) and says sharpness "can be measured and charted in the Modulation Transfer Curve"; gives no single lines/mm figure in the text; lists 65mm (SP332). — [Kodak brochure](https://www.kodak.com/content/products-brochures/motion-picture/KODAK-VISION3-500T-5219-7219-brochure.pdf)
- [INDEP, forum opinion] No one has measured the theoretical resolution of 15/70 IMAX; 18K is untested. — [Audioholics forum](https://forums.audioholics.com/forums/goto/post?id=357134)

### Inferences
- [EST] "K" for film is only meaningful as the spatial frequency at which MTF falls to a stated threshold (e.g., 10%) times frame width; a 15/70 frame ~70 mm wide at an assumed 100 lp/mm limit gives ~7,000 line pairs ~14,000 lines, so 14K corresponds to ~100 lp/mm at 10% MTF on the negative, before lens, printing/projection losses. This is my arithmetic, not a sourced figure; projected release prints and the projector lens will be well below the negative.
- Counting "per colour" is a way to compare against Bayer sensors; it does not describe what an audience sees from a release print.

### Gaps
- No IMAX primary document with the exact sentence; no Kodak 65mm-specific MTF numbers; no independent measured MTF of 15/70 neg or print. ASC primary article on 65mm resolution not found.

## 5. Does more pixels = better image? Acuity and viewing distance

### Takeaway
Resolution benefit depends on pixels per degree at the seat. The latest peer-reviewed measurement puts foveal achromatic limit at ~94 ppd (above the 60 ppd 20/20 benchmark), with colour detail far lower.

### Cited Findings
- [INDEP, peer-reviewed] Ashraf, Chapiro, Mantiuk, Nature Communications 16 (2025), DOI 10.1038/s41467-025-64679-2: foveal achromatic limit 94 ppd; red-green 89; yellow-violet 53; colour sensitivity drops steeply, esp. in periphery; compared against 60 ppd (20/20). — [arXiv 2410.06068](https://arxiv.org/pdf/2410.06068), [Cambridge project page](https://www.cl.cam.ac.uk/research/rainbow/projects/resolution_limit/), [DOAJ listing](https://doaj.org/article/f01680f7077448d2a59a8b0247626335). (Details taken from search summaries; PDF too large to fetch.)
- [STD] DCI itself only requires projectors >= 2K/4K container pixel count (s8.2.2.6), not a perceptual threshold. — see section 1.

### Inferences
- [EST] Pixels per degree = horizontal pixels / horizontal viewing angle. A 4096-wide image filling 60 deg (centre-ish seat in a large auditorium) ~68 ppd; filling 90 deg (front rows of a big screen) ~45 ppd; 2K at 60 deg ~34 ppd. So 4K exceeds the 60 ppd benchmark only where the image subtends <~68 deg, and near the 94 ppd limit only below ~44 deg. In front-half seats of giant screens, resolution is the binding constraint; mid-to-rear seats cannot resolve beyond 4K for typical eyes. Also, lens, screen, glare, and content mastering often limit before pixel count.

### Gaps
- No cinema-specific controlled study (2K vs 4K vs film) with audience seat positions found; Nature Comms study used a display, not cinema; I did not read its limitations.
