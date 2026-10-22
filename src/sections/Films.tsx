import { useState } from 'react'
import { Ev } from '../components/Ev'

const VIDEOS = [
  {
    id: 'hxb0FPH0k-U',
    title: 'Dune: Part Two | Official IMAX 1.90 Trailer 2',
    note: 'Released by IMAX as a 1.90 trailer: close to the shape of most IMAX screens, a little wider than your laptop.',
  },
  {
    id: 'M57L-h61V6A',
    title: 'Oppenheimer | Shooting For IMAX | Christopher Nolan',
    note: 'The filmmakers on shooting with IMAX film cameras, the source of the tall 1.43 frame.',
  },
]

/** Shows a still and title; YouTube loads only after you press play. */
function Video({ id, title, note }: (typeof VIDEOS)[number]) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-[4px] bg-velvet">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="group absolute inset-0 cursor-pointer" onClick={() => setPlaying(true)}>
            <img
              src={thumb}
              onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-lamp py-2 pr-5 pl-3 text-black">
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                <path d="M6 4l10 6-10 6z" fill="currentColor" />
              </svg>
              <span className="font-bold">Play</span>
              <span className="sr-only">{title} (loads YouTube)</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-bold">{title}</span>
        <span className="small block mt-1 max-w-[52ch]">{note}</span>
      </figcaption>
    </figure>
  )
}

export default function Films() {
  return (
    <section data-shot="films" className="scene" aria-labelledby="films-title">
      <h2 id="films-title" className="display h-section max-w-[14ch]">
        See it in real films.
      </h2>
      <p className="body mt-5">
        Two official videos from IMAX, embedded as published
        <Ev k="independent" s="imaxYoutube" />. A browser can&rsquo;t show you a theatre&rsquo;s ratio, since your own
        screen sets the limit, but you can watch how the frame is built. The YouTube player loads only when you press play.
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {VIDEOS.map((v) => (
          <Video key={v.id} {...v} />
        ))}
      </div>
    </section>
  )
}
