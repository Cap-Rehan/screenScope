// Citations, taken from reports/Cinema formats fact check.md. Labels follow that report.

export type Kind = 'standard' | 'filing' | 'claim' | 'independent' | 'estimate'

export const KIND_LABEL: Record<Kind, string> = {
  standard: 'Industry standard',
  filing: 'SEC filing',
  claim: 'Manufacturer claim',
  independent: 'Independent source',
  estimate: 'Estimate or our arithmetic',
}

export type Source = { title: string; url: string; note?: string }

export const SOURCES = {
  tenk: {
    title: 'IMAX Corporation, Form 10-K for fiscal 2025',
    url: 'https://www.sec.gov/Archives/edgar/data/921582/000162828026011770/imax-20251231.htm',
    note: 'System counts at 31 Dec 2025. Laser count not quoted: the extracted table did not reconcile.',
  },
  engadget: {
    title: 'Engadget: how to tell the difference between IMAX and "LieMAX"',
    url: 'https://engadget.com/2244674/how-to-tell-difference-imax-liemax/',
    note: 'Single outlet for the system-to-ratio mapping.',
  },
  wikipedia: {
    title: 'Wikipedia: IMAX',
    url: 'https://en.wikipedia.org/wiki/IMAX',
    note: 'Secondary source; used for 1.90:1, frame size and legacy sound only.',
  },
  displaydaily2018: {
    title: 'Display Daily: IMAX upgrades its laser projector (2018 CTO interview)',
    url: 'https://displaydaily.com/imax-upgrades-laser-projector/',
    note: 'Interview figures, not measurements.',
  },
  whathifi: {
    title: 'What Hi-Fi: IMAX launches laser projection system in the UK',
    url: 'https://www.whathifi.com/news/imax-launches-laser-projection-system-in-uk-and-it-looks-spectacular',
    note: 'Press repeating launch material; 12-channel figure unverified against IMAX.',
  },
  christie: {
    title: 'Christie: Dolby selects Christie to co-develop Dolby Vision projection',
    url: 'https://christiedigital.com/press-releases/dolby-selects-christie-to-co-develop-dolby-vision-projection-systems-for-dolby-cinema',
    note: '31 fL is stated for a unity-gain screen; no independent test found.',
  },
  atmos: {
    title: 'Dolby Professional: Dolby Atmos for cinema',
    url: 'https://professional.dolby.com/cinema/dolby-atmos/',
  },
  st4311: {
    title: 'SMPTE ST 431-1:2006, screen luminance level and chromaticity',
    url: 'https://pub.smpte.org/doc/st431-1/20060418-pub/st0431-1-2006.pdf',
  },
  dci: {
    title: 'DCI Digital Cinema System Specification v1.3 (third-party mirror)',
    url: 'https://source.netsyms.com/skylarmt/glenwing.github.io_withhdmi/raw/branch/master/docs/DCI-1.3.pdf',
  },
  ymcinema16k: {
    title: 'YMCinema: IMAX says 15/70 holds "14K to 16K per color"',
    url: 'https://ymcinema.com/2026/07/07/imax-odyssey-16k-per-color/',
    note: 'Second-hand; the speaker is unnamed and no measurement is given.',
  },
  kodak: {
    title: 'Kodak VISION3 500T 5219/7219 technical brochure (MTF chart)',
    url: 'https://www.kodak.com/content/products-brochures/motion-picture/KODAK-VISION3-500T-5219-7219-brochure.pdf',
    note: 'Curves digitised from the published chart, which ends at 80 cycles/mm. The stock is also sold in 65 mm.',
  },
  asc: {
    title: 'American Cinematographer: Expanding the View for Dune: Part Two (Jan 2025)',
    url: 'https://theasc.com/articles/expanding-the-view-for-dune-part-two',
    note: 'Says what was protected, not how each version was cropped.',
  },
  disney: {
    title: 'Disney: IMAX Enhanced launches on Disney+ with Marvel titles (Nov 2021)',
    url: 'https://press.disney.co.uk/news/imax-enhanced-to-launch-on-disney+-with-titles-from-the-marvel-cinematic-universe-in-imax-s-expanded-aspect-ratio',
  },
  slashfilmImax: {
    title: 'SlashFilm: Filmed for IMAX vs Shot with IMAX (Jul 2026)',
    url: 'https://www.slashfilm.com/2225704/filmed-for-imax-vs-shot-with-imax-difference/',
  },
  guinness: {
    title: 'Guinness World Records: largest permanent cinema screen (overall)',
    url: 'https://www.guinnessworldrecords.com/world-records/729198-largest-permanent-cinema-screen-overall',
    note: 'IMAX Traumpalast Leonberg, 38.80 × 21.00 m, verified 6 Dec 2022.',
  },
  visitlondon: {
    title: 'Visit London: BFI IMAX',
    url: 'https://www.visitlondon.com/things-to-do/place/284861',
  },
  acuity: {
    title: 'Ashraf et al., resolution limit of the eye (arXiv 2410.06068; Nature Communications 2025)',
    url: 'https://arxiv.org/pdf/2410.06068',
    note: 'A display study, not a cinema study.',
  },
  slashfilm: {
    title: 'SlashFilm: Q&A on IMAX and "LieMAX"',
    url: 'https://www.slashfilm.com/qa-imax-theatre-real-imax-liemax',
  },
  barco: {
    title: 'Barco DP4K-60L specification sheet',
    url: 'https://assets.barco.com/m/75224f028c2f9d4b/original/DP4K-60L-es-Spec-sheet.pdf',
  },
  dolbyModel: {
    title: 'Display Daily: a Dolby researcher’s model of real cinema contrast',
    url: 'https://displaydaily.com/?p=56076',
    note: 'Manufacturer research, validated on five Dolby Vision venues; not independent.',
  },
  dciHdr: {
    title: 'Display Daily: DCI explains and decides what HDR is in cinemas',
    url: 'https://displaydaily.com/dci-explains-and-decides-what-hdr-is-in-cinemas/',
  },
  st2113: {
    title: 'SMPTE ST 2113:2018, colorimetry of P3 color spaces',
    url: 'https://pub.smpte.org/pub/st2113/st2113-2018.pdf',
    note: 'Blue primary read from a secondary summary.',
  },
  bt709: {
    title: 'ITU-R Recommendation BT.709 (HDTV)',
    url: 'https://www.itu.int/rec/R-REC-BT.709',
  },
  bt2020: {
    title: 'ITU-R Recommendation BT.2020 (UHDTV)',
    url: 'https://www.itu.int/rec/R-REC-BT.2020',
  },
  christieRgb: {
    title: 'Christie CP4325-RGB datasheet',
    url: 'https://christiedigital.com/globalassets/resources/public/christie-cp4325-rgb-datasheet.pdf',
    note: 'Datasheet says >90% Rec. 2020; the product page says >95%.',
  },
  cie: {
    title: 'CVRL: CIE 1931 2° colour matching functions',
    url: 'http://www.cvrl.org/database/data/cmfs/ciexyz31_1.csv',
    note: 'Used to draw the spectral locus.',
  },
  nasa: {
    title: 'NASA/Joel Kowsky: Artemis I launch, 16 Nov 2022 (NHQ202211160006)',
    url: 'https://images.nasa.gov/details/NHQ202211160006',
    note: 'Public domain NASA imagery, cropped to 1.43:1 by ScreenScope.',
  },
  imaxYoutube: {
    title: 'IMAX official YouTube channel (@imaxmovies)',
    url: 'https://www.youtube.com/@imaxmovies',
    note: 'Videos embedded unmodified with YouTube’s player.',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES
