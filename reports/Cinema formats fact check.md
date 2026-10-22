# Separating IMAX measurable facts from marketing

**Bottom line for ScreenScope: "IMAX" is a brand covering several different projection systems, not one fixed experience, and 1.43:1 is the exception rather than the rule.** IMAX's own FY2025 10-K says the 1.43 ratio is "IMAX-exclusive" and available only "in select IMAX locations" out of 1,864 systems ([IMAX 10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)). Independent sources say only 15/70 film and dual-projector laser (GT) on a tall screen show full 1.43; single-projector laser and xenon digital are 1.90:1 ([Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/)). The only standard-backed numbers are Dolby/DCI-type ones: ST 431-1 sets a nominal 14 fL (48 cd/m2) screen luminance with a +/-3 fL theatre tolerance ([SMPTE ST 431-1](https://pub.smpte.org/doc/st431-1/20060418-pub/st0431-1-2006.pdf)). Nearly everything else (IMAX 22 fL, ">10,000:1", Dolby "1,000,000:1", 70mm "14K-16K") is a manufacturer or press claim with no independent measurement found. Film has no pixels, so "70mm = 16K" must not be stated as fact. This brief rests on three note files of limited depth (about 12 tool calls each); imax.com returned 403, RP 431-2 was not read, and several areas were not researched (see Research gaps). Where a claim could not be sourced, it is marked unresolved or omitted.

**Labels used:** *Standard* (read in the standard text), *SEC filing*, *Manufacturer claim*, *Independent* (third party, including practitioner opinion and peer-reviewed work), *Estimate*, *Unresolved*.

## Aspect ratios and which systems show 1.43:1

An aspect ratio is image width divided by height. Letterboxing means black bars above and below a wide image; cropping means cutting image off to fit; an "expanded" release means a film shown in a taller ratio than its theatrical standard, revealing more picture top and bottom.

IMAX's 10-K says movies shot on IMAX cameras have an IMAX-exclusive 1.43 aspect ratio only in select locations, and that remastering delivers "up to 26% more image onto a standard IMAX screen" ([10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)) *(SEC filing; manufacturer claim)*. The filing text read does not state 1.90:1 itself, and the link between "26%" and 1.90 vs 1.43 is my inference. The 1.90:1 figure for standard IMAX digital comes from independent sources: Wikipedia, and a Korean fact-check that attributes it to imax.com ([Wikipedia](https://en.wikipedia.org/wiki/IMAX); [Cineplay](https://www.cineplay.co.kr/en-us/articles/29265)) *(independent, secondary)*.

For systems, the 10-K lists Laser, Xenon and Film. At 12/31/2025: 1,089 Xenon systems (down from 1,178; no longer offered for new signings), 52 Film systems in 52 locations, and 757 Laser per the extracted table. The Laser/Xenon/Film extraction did not reconcile to 1,864, so verify against the filing. The 10-K says Laser comes in "two different configurations" but, in the text read, never names them *(SEC filing)*. Engadget identifies them: GT Laser (dual 4K) can project 1.43 in suitably equipped theatres, while CoLa and XT single-projector laser typically max out at 1.90:1, and Xenon is the older dual-2K system from 2008 ([Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/)) *(independent)*. Single-projector laser began in 2018 ([Display Daily](https://displaydaily.com/imax-upgrades-laser-projector/)). Dolby Cinema cannot duplicate 1.43 (Engadget).

How many screens show true 1.43 is **unresolved**. Third-party figures are about 41 locations with a 1.43 screen plus film projector and about 20 GT laser screens ([Dark Horizons](https://www.darkhorizons.com/?p=193391); [Cineplay](https://www.cineplay.co.kr/en-us/articles/29265)) *(estimate)*; the 10-K counts 52 film locations, and the two numbers are not reconciled. In 2023 about 30 venues ran Oppenheimer in IMAX 70mm ([YMCinema](https://ymcinema.com/2023/06/05/oppenheimer-imax-70mm-screening-at-only-30-theaters-worldwide/)). One UK guide counts exactly three full 1.43 GT venues despite dozens of IMAX-branded screens ([CinemaView](https://cinemaview.in/es/blog/uk-imax-70mm-gt-cinemas-guide)). Wikipedia notes fewer than a quarter of 1,305 systems in late 2017 could show 70mm film *(independent, secondary)*.

The 15/70 frame size is also unsettled. The commonly quoted image is **69.6 x 48.5 mm** (about 1.43:1) ([Wikipedia](https://en.wikipedia.org/wiki/IMAX)), while a film-recorder discussion cites 70.41 x 52.63 mm (about 1.34:1), and no source cleanly labels which is camera versus projected aperture ([cinematography.net](https://cinematography.net/edited-pages/IMAX15perf_70mmTechSpecs.htm)) *(independent; labelling unresolved)*. Publish only the 69.6 x 48.5 mm figure, attributed, if at all.

## Resolution, contrast, brightness and colour: what is a standard and what is a brochure

**Pixel count.** DCI v1.3 requires projector pixel count equal to or greater than the image container, 4096x2160 or 2048x1080 ([DCI v1.3 mirror](https://source.netsyms.com/skylarmt/glenwing.github.io_withhdmi/raw/branch/master/docs/DCI-1.3.pdf)) *(standard; third-party mirror, dcimovies.com unreachable)*. IMAX Laser GT uses two 4K projectors with half-pixel offset; a trade report describes "perceived" greater-than-4K resolution, which is the reporter's wording, not a native spec ([What Hi-Fi](https://www.whathifi.com/news/imax-launches-laser-projection-system-in-uk-and-it-looks-spectacular)) *(manufacturer claim via press)*. Dolby Cinema also uses two Christie 4K laser heads ([Christie/Dolby release](https://christiedigital.com/press-releases/dolby-selects-christie-to-co-develop-dolby-vision-projection-systems-for-dolby-cinema)), so nominal resolution does not separate the two.

**Why film is not "16K".** Film is analogue with no pixels. Kodak charts sharpness as MTF, response versus spatial frequency in sine waves per mm, rather than a K number ([Kodak VISION3 brochure](https://www.kodak.com/content/products-brochures/motion-picture/KODAK-VISION3-500T-5219-7219-brochure.pdf)) *(manufacturer)*. MTF (modulation transfer function) is a curve of how much contrast survives at finer and finer detail; any "K" figure needs a chosen cutoff on that curve. IMAX is reported to say each 15/70 frame holds "roughly 14K to 16K" "per color", from an Odyssey behind-the-scenes video, but the speaker is unnamed, the full sentence was not obtained, and YMCinema itself notes it is not a 1:1 equal of a 16K RGB file ([YMCinema, 7 Jul 2026](https://ymcinema.com/2026/07/07/imax-odyssey-16k-per-color/)) *(manufacturer claim, second-hand)*. Other outlets say 14K-18K, ~12K or 18K ([Mezha](https://mezha.ua/en/articles/imax-70mm-313942/); [YMCinema 2023](https://ymcinema.com/2023/01/27/nolans-oppenheimer-imax-15-70-and-18k-resolution/)); a forum post notes no one has measured it ([Audioholics](https://forums.audioholics.com/forums/goto/post?id=357134)). Practitioners note film-recorder gains above about 4Kx3K are limited by spot size, and a 15-perf frame is about 2.7x the area of 35mm open gate ([cinematography.net](https://cinematography.net/edited-pages/IMAX15perf_70mmTechSpecs.htm)) *(independent, opinion)*. My own arithmetic, an *estimate* and not sourced: at an assumed 100 lp/mm limit across ~70 mm, the negative reaches about 14,000 lines, but lens, print and projector losses mean the screen image is lower. "Per colour" is a comparison device against Bayer sensors, not what a viewer sees from a release print.

**Brightness and contrast.** ST 431-1 nominal is 14 fL (48 cd/m2), theatre tolerance +/-3 fL (about 11-17 fL), measured at screen centre with 100% white at a seat near the centre of the room; it does not specify contrast ([SMPTE ST 431-1](https://pub.smpte.org/doc/st431-1/20060418-pub/st0431-1-2006.pdf)) *(standard)*. So 14 fL is a nominal value with a tolerance band, not a floor. Contrast figures I found for RP 431-2 (sequential nominal 2000:1, minimum 1200:1; intra-frame 150:1 nominal, 100:1 minimum) come only from a secondary site ([Cinepedia](https://cinepedia.com/picture/image-contrast-dynamic-range-and-high-dynamic-range/)) *(unresolved until RP 431-2 is read)*. Sequential contrast compares full-white to full-black frames; intra-frame (ANSI-style) contrast compares bright and dark areas within one frame and is always lower. Barco's spec sheet shows both: 2,800:1 native versus 500:1 ANSI typical ([Barco DP4K-60L](https://assets.barco.com/m/75224f028c2f9d4b/original/DP4K-60L-es-Spec-sheet.pdf)) *(manufacturer)*. IMAX's only primary-ish numbers are a 2018 CTO interview: "over 10,000:1 sequential" and "about the same - 22 fL (75 cd/m2)" ([Display Daily](https://displaydaily.com/imax-upgrades-laser-projector/)) *(manufacturer claim, no measurement)*. Dolby's 31 fL 2D / 14 fL 3D is from a Christie/Dolby release ([link](https://christiedigital.com/press-releases/dolby-selects-christie-to-co-develop-dolby-vision-projection-systems-for-dolby-cinema)) *(manufacturer claim)*. The "1,000,000:1" figure appears in press (Pocket-lint, 91mobiles) but not in that release, and one source says Dolby did not state a contrast level ([Pocket-lint](https://www.pocket-lint.com/nl-nl/tv/nieuws/dolby/142028-wat-is-dolby-cinema)) *(marketing; do not publish)*.

Real rooms fall short of spec sheets. A Dolby researcher's model, validated on five Dolby Vision venues, found achievable contrast around 10% average picture level of roughly 100:1, 1,800:1 and 2,500:1 for three configurations, with audience reflections cutting contrast by up to about 25% ([Display Daily](https://displaydaily.com/?p=56076)) *(manufacturer research, not independent)*. I found no independent measurement of IMAX's 22 fL or Dolby's 31 fL.

**HDR and gamut.** HDR (high dynamic range) means a wider brightness span between the darkest and brightest picture. DCI double-blind tests found 0.005 cd/m2 black "enough to give a compelling HDR experience" and a preference step up at 300 cd/m2 and above ([Display Daily](https://displaydaily.com/dci-explains-and-decides-what-hdr-is-in-cinemas/)) *(independent-ish industry test)*. Colour gamut is the range of colours a system can show. The DCI-P3 primaries are R (0.680, 0.320), G (0.265, 0.690), B (0.150, 0.060) with white (0.314, 0.351) ([SMPTE ST 2113:2018](https://pub.smpte.org/pub/st2113/st2113-2018.pdf)) *(standard; blue primary from a secondary summary)*. Rec. 2020 is a wider gamut; Christie's CP4325-RGB claims >90% coverage on its datasheet but >95% on its product page ([datasheet](https://christiedigital.com/globalassets/resources/public/christie-cp4325-rgb-datasheet.pdf)) *(manufacturer; internally inconsistent)*. Claims that IMAX Laser or Dolby Cinema "cover Rec. 2020" were not verified for any specific auditorium.

**More pixels is not automatically better.** What matters is pixels per degree (ppd) at the seat. A 2025 Nature Communications study measured a foveal achromatic limit of about 94 ppd versus the 60 ppd 20/20 benchmark, with colour detail far lower ([arXiv 2410.06068](https://arxiv.org/pdf/2410.06068)) *(independent, peer-reviewed, display study, not cinema)*. My *estimate*: 4096 pixels across a 60-degree view gives about 68 ppd; across 90 degrees about 45 ppd; so resolution limits mainly the front half of giant screens, while lens, glare and content often limit first.

## Sound and the premium formats: what differs and what is unverified

IMAX's 10-K says only that its systems use "proprietary loudspeaker systems and proprietary surround sound configurations" ([10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)) *(SEC filing)*. Channel counts come from secondary sources: legacy systems about 6 channels, IMAX with Laser 12 (four overhead plus two extra side) ([Wikipedia](https://en.wikipedia.org/wiki/IMAX); [What Hi-Fi](https://www.whathifi.com/news/imax-launches-laser-projection-system-in-uk-and-it-looks-spectacular)) *(secondary; unverified against IMAX)*. A forum quote of an interview mentions 5.0, 11.0 or 12.0 layouts, contradicting "12 plus sub" press wording ([Audioholics](https://forums.audioholics.com/forums/goto/post?id=1517095)) *(unresolved)*. Dolby documents Atmos cinema as a 9.1 bed plus up to 118 objects, up to 64 discrete speaker feeds ([Dolby Professional](https://professional.dolby.com/cinema/dolby-atmos/)) *(manufacturer claim; from press and a web page, not a spec document)*. An audio "object" is a sound with positional metadata rendered to whatever speakers a room has, versus a "channel" fixed to a speaker. Safe wording: IMAX uses proprietary channel-based layouts; Atmos has a higher format ceiling, but real rooms vary and per-theatre speaker counts were not found. Whether any IMAX theatre plays native Atmos is **unresolved**. IMAX Enhanced (home) uses DTS:X, a separate consumer program ([Sound & Vision](https://www.soundandvision.com/content/denon-and-marantz-get-imax-enhanced-update)).

| Format | Verified facts | Limits and variation |
|---|---|---|
| IMAX 15/70 film | 65mm negative, 70mm print; 1.43:1; typical 18 x 24 m screens, largest ~38 x 22 m (Wikipedia, secondary); 52 film systems at 12/31/2025 (10-K) | Few venues; analogue, grain and print wear; resolution not a fixed pixel count |
| IMAX with Laser (GT) | Dual 4K, 1.43-capable on tall screens (Engadget); 12-channel sound reported | Count of GT screens unresolved; brightness claim is IMAX interview only |
| IMAX with Laser (single projector) | 4K, typically 1.90:1 (Engadget) | Not full 1.43; auditorium sizes vary |
| IMAX Xenon digital | Older dual 2K, 2008; being phased out for new signings (10-K) | 1.90:1; 1,089 installed at end 2025 |
| Dolby Cinema | Dual Christie 4K laser; Dolby claims 31 fL 2D, 14 fL 3D; Atmos | Spec numbers only from press; cannot show 1.43; screen size varies |
| Standard digital (DCI) | 2K or 4K container; 14 fL nominal +/-3 (ST 431-1) | Measured on-screen white only; lamp age, dirt, 3D losses reduce real output |

The 10-K confirms Laser gives "greater brightness and clarity, higher contrast, a wider color gamut and deeper blacks" than prior IMAX systems and that screen sizes vary, but it gives no per-theatre dimensions. Smallest versus largest screen area differs by roughly ten times, per Wikipedia (secondary). IMAX's theatre finder does not detail projector setup ([Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/)). "LieMAX" is a fan nickname from about 2009 with no technical definition ([SlashFilm](https://www.slashfilm.com/qa-imax-theatre-real-imax-liemax)).

## Deliverable A: fact sheet for website copy

Use only these, with the labels shown.
- IMAX is a brand covering film, laser and xenon digital systems; IMAX's filing lists all three and says sizes and configurations vary. *(SEC filing)*
- The 1.43:1 ratio is IMAX-exclusive and available only in select locations. *(SEC filing)*
- An aspect ratio is width divided by height; 1.43 is nearly square, 2.39 is very wide.
- Most IMAX screens are 1.90:1, and IMAX says remastered releases deliver up to 26% more image on a standard IMAX screen. *(1.90 independent; 26% manufacturer)*
- Full 1.43 needs 15/70 film or dual-projector laser on a suitably tall screen. *(independent)*
- DCI's theatre standard is a nominal 14 fL with a +/-3 fL tolerance, measured at the screen with white. *(standard)*
- Film records detail as a continuous curve (MTF), not pixels; "K" figures for film are conventions, not fixed counts. *(manufacturer plus explanation)*
- IMAX's film-resolution claim of "14K-16K per color" is a manufacturer claim reported second-hand. *(manufacturer claim)*
- Pixels help only up to what the eye resolves from the seat, roughly 60 to 94 pixels per degree. *(independent, peer-reviewed, not cinema-specific)*
- IMAX sound is proprietary; Dolby Atmos is documented at a 9.1 bed plus up to 118 objects. *(SEC filing; manufacturer claim)*

## Deliverable B: claim table

| Claim | Verified explanation | Source | Label | Confidence | Caveats |
|---|---|---|---|---|---|
| 1.43 is exclusive and only in select IMAX locations | Direct filing wording | [10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm) | SEC filing | High | Does not say which systems |
| Standard IMAX digital is 1.90:1 | Secondary and fact-check attribution | [Wikipedia](https://en.wikipedia.org/wiki/IMAX) | Independent | Medium | No IMAX primary quote; 10-K text read omits it |
| Single-projector laser max 1.90; GT dual 4K can do 1.43 | Engadget explanation | [Engadget](https://engadget.com/2244674/how-to-tell-difference-imax-liemax/) | Independent | Medium | One outlet; theatre finder gives no setup |
| About 41 film + 20 GT 1.43 screens | Unsourced counts | [Dark Horizons](https://www.darkhorizons.com/?p=193391) | Estimate | Low | 10-K says 52 film locations; not reconciled |
| 1,864 systems in 91 countries; Xenon 1,089, Film 52 | Filing counts | [10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm) | SEC filing | High (totals); Medium (Laser 757) | Extracted table columns unclear |
| 15/70 frame 69.6 x 48.5 mm | Commonly quoted image size | [Wikipedia](https://en.wikipedia.org/wiki/IMAX) | Independent | Medium | 70.41 x 52.63 mm also cited; unresolved |
| Nominal 14 fL, +/-3 fL tolerance | ST 431-1 Table 1 | [SMPTE](https://pub.smpte.org/doc/st431-1/20060418-pub/st0431-1-2006.pdf) | Standard | High | Contrast not in this document |
| Cinema contrast min 1200:1 / 100:1 intra-frame | Secondary only | [Cinepedia](https://cinepedia.com/picture/image-contrast-dynamic-range-and-high-dynamic-range/) | Unresolved | Low | RP 431-2 not read |
| IMAX Laser 22 fL, >10,000:1 | CTO interview, 2018 | [Display Daily](https://displaydaily.com/imax-upgrades-laser-projector/) | Manufacturer claim | Low as spec | No measurement; unit and method unclear |
| Dolby 31 fL 2D / 14 fL 3D | Release wording | [Christie](https://christiedigital.com/press-releases/dolby-selects-christie-to-co-develop-dolby-vision-projection-systems-for-dolby-cinema) | Manufacturer claim | Low-Medium | Unity-gain screen; no independent test |
| Dolby 1,000,000:1 | Press repeats | [Pocket-lint](https://www.pocket-lint.com/nl-nl/tv/nieuws/dolby/142028-wat-is-dolby-cinema) | Manufacturer claim (press) | Very low | Not in Christie release |
| 70mm = 14K-16K per colour | Second-hand IMAX video | [YMCinema](https://ymcinema.com/2026/07/07/imax-odyssey-16k-per-color/) | Manufacturer claim | Low | No measurement; no fixed pixel mapping |
| Foveal acuity limit about 94 ppd | Peer-reviewed measurement | [arXiv](https://arxiv.org/pdf/2410.06068) | Independent | Medium | Display study; details from summaries |
| DCI projector pixel count at least container size | DCI s8.2.2.6 | [DCI v1.3 mirror](https://source.netsyms.com/skylarmt/glenwing.github.io_withhdmi/raw/branch/master/docs/DCI-1.3.pdf) | Standard | High | Mirror; v1.4+ not read |
| IMAX laser sound has 12 channels | Press and Wikipedia | [What Hi-Fi](https://www.whathifi.com/news/imax-launches-laser-projection-system-in-uk-and-it-looks-spectacular) | Manufacturer claim via press | Medium-Low | Forum quote contradicts; unverified |
| Atmos 9.1 bed, 118 objects, 64 feeds | Dolby page | [Dolby](https://professional.dolby.com/cinema/dolby-atmos/) | Manufacturer claim | Medium-High | Wikipedia says 7.1.2; per-room counts vary |

## Deliverable C: misconceptions and corrections

1. **"All IMAX screens are the same."** False: the 10-K lists Laser, Xenon and Film systems with varied sizes ([10-K](https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm)).
2. **"IMAX means 1.43:1."** False: 1.43 is exclusive and only in select locations; most screens are 1.90 (10-K; Engadget).
3. **"IMAX 70mm is exactly 16K."** Unsupported: film has no pixels; K figures depend on an MTF cutoff and are unmeasured claims.
4. **"More pixels always looks sharper."** Only up to what the eye resolves from the seat; Dolby Cinema and IMAX Laser both use 4K nominal, yet differ in screen size, brightness and sound.
5. **"DCI requires 14 fL minimum."** It is a nominal value with a +/-3 fL tolerance (ST 431-1).
6. **"Dolby's contrast is a million to one."** A press figure with no standard or independent measurement; real contrast depends on content and room.
7. **"IMAX Laser is brighter than anything."** The 22 fL figure is one interview and the Dolby 31 fL is a Dolby claim on a unity-gain screen; no independent comparison exists.
8. **"IMAX equals Dolby Atmos."** Not supported by the 10-K, which says only "proprietary" sound; native Atmos in IMAX is unresolved.
9. **"Expanded ratio means the film was changed."** It means more of a taller frame is shown; the cropping/expansion mechanics were not sourced in this research.

## Deliverable D: interactive demonstrations

1. **Aspect ratios:** an overlay slider showing the same still at 2.39, 1.90, 1.85 and 1.43 inside one screen outline, with bars appearing and the "26% more image" claim computed live and flagged as IMAX's wording.
2. **Systems:** a screen-shape selector (15/70, GT, single laser, xenon) that shows which ratio each presents, with a label on every system's evidence level.
3. **Resolution and pixels per degree:** a seat-position slider that computes ppd for 2K versus 4K against the 60 and 94 ppd lines, labelled as an estimate.
4. **Film "K":** an MTF curve where the user moves the cutoff and watches the "K" number change, showing why one frame has no fixed K.
5. **Contrast and brightness:** a nominal 14 fL band (11-17 fL) beside claimed 22 and 31 fL, plus a veiling-glare slider showing sequential versus intra-frame contrast, labelled illustrative.
6. **Sound:** a channel-versus-object toggle showing a fixed-speaker layout versus an object rendered into rooms of different speaker counts, using only documented Atmos figures.
7. **Myth-or-fact quiz:** each answer carries its label and source link.

## Deliverable E: claims to avoid publishing

- "70mm is 16K" or "18K" or "12K" as fact.
- "Dolby Cinema has 1,000,000:1 contrast."
- IMAX Laser "22 fL" or ">10,000:1" as measured performance.
- Exact counts of 1.43-capable screens (41, 20, 60 or 30).
- "IMAX uses Atmos" or "IMAX has 12 channels" as IMAX-confirmed fact.
- "14 fL minimum" or "RP 431-2 requires 1200:1" without the primary text.
- Any 15/70 frame size labelled "camera" versus "projected".
- "Rec. 2020 coverage" for a named auditorium.
- "Typical cinemas run 3.5 to 6 fL" (unnamed source).
- "LieMAX" as a technical category.

## Research gaps

- **2.39:1 and 1.85:1 handling, and home-video/streaming expansion** (including IMAX Enhanced expanded releases) were not researched; the letterboxing geometry here is my inference.
- **imax.com returned 403**, so no IMAX specification page or sound page was read; the Oppenheimer page claim is paraphrased from a search summary.
- **SMPTE RP 431-2 was not read**; contrast minimums are from a secondary site. DCI v1.4+ and any HDR requirements were not checked, and dcimovies.com was unreachable (a third-party mirror of v1.3 was used).
- **IMAX sound channel count is unverified**; the last ~60k characters of the 10-K and the Item 1 text between reads were not fully read, so "12-channel", "Atmos" or "1.90" may appear there. A grep of the filing is the fastest fix.
- **Dolby spec numbers come only from press and Wikipedia**; no Dolby white paper or NEC spec sheet was retrieved, and Christie CP4450-RGB contrast was not found.
- **No independent field measurements** of IMAX or Dolby brightness and contrast in real auditoriums; no per-theatre speaker counts or screen sizes; no Sonics or Auro-3D data.
- The Laser versus Xenon system table in the 10-K had unclear columns; the 52 versus 41 film-location discrepancy is unreconciled.
- No Kodak 65mm-specific MTF numbers and no measured MTF of 15/70 negative or print; the 94 ppd study was read via summaries only.
- Several sources carry 2026 dates and could not be cross-checked beyond the notes.

## Conclusion

The defensible ScreenScope position is to teach the framework rather than the brand claims: ask which projection system, which screen shape and which measurement method sits behind any number. The strongest facts are the filing-backed and standard-backed ones (system families, 1.43 as select-location, ST 431-1's nominal 14 fL with tolerance), and nearly every headline superlative in this field is either a manufacturer statement or unmeasured. Closing the highest-value gaps (read the full 10-K, obtain RP 431-2, read an IMAX or Dolby primary spec) would upgrade several "unresolved" rows to publishable.
