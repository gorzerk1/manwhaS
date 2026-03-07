import { Clock } from 'lucide-react';

interface MainChapterProps {
  title: string;
  logoUrl: string;
  sideImageUrl: string;
  status: string;
  type: string;
  author: string;
  artist: string;
  updatedOn: string;
  synopsis: string;
  genres: string[];
  keywords: string[];
}

export default function MainChapter({
  title,
  logoUrl,
  sideImageUrl,
  status,
  type,
  author,
  artist,
  updatedOn,
  synopsis,
  genres,
  keywords,
}: MainChapterProps) {
  return (
    <div className="bg-[var(--color-bg-primary)] rounded-xl p-6 shadow-lg border border-white/5 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl pointer-events-none"
        style={logoUrl ? { backgroundImage: `url(${logoUrl})` } : undefined}
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        <div className="w-full flex-shrink-0">
          <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--color-bg-secondary)] relative group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg-thirdy)] text-sm text-white/50">
                No cover image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-secondary)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-secondary)]">
            <span className="flex items-center gap-1 text-white">
              <Clock className="w-4 h-4" /> Updated on {updatedOn}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-white/80">Author: {author}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-white/80">Artist: {artist}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-[var(--color-bg-thirdy)]/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center border-r border-white/10">
              <div className="font-bold text-lg text-white">{status}</div>
              <span className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">Status</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-white/10">
              <div className="font-bold text-lg text-[var(--color-bg-secondary)]">{type}</div>
              <span className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">Type</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="font-bold text-lg text-[var(--color-bg-secondary)]">{genres.length}</div>
              <span className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">Genres</span>
            </div>
          </div>

          <div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {synopsis}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full bg-[var(--color-bg-thirdy)] text-xs text-white/80 hover:bg-[var(--color-bg-secondary)] hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-sm text-[var(--color-secondary)]">No genres listed.</span>
            )}
          </div>
        </div>

        {(sideImageUrl || keywords.length > 0) && (
          <div className="space-y-4">
            {sideImageUrl && (
              <div className="overflow-hidden rounded-xl border border-white/5 bg-[var(--color-bg-thirdy)]/40">
                <img
                  src={sideImageUrl}
                  alt={`${title} side art`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-[var(--color-bg-thirdy)]/40 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                Keywords
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                  keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--color-secondary)]">No keywords listed.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
