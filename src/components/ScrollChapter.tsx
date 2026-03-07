import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Chapter {
  id: string;
  number: string;
  label: string;
  date: string;
}

interface ScrollChapterProps {
  mangaSlug: string;
  chapters: Chapter[];
  isLoading?: boolean;
  errorMessage?: string | null;
}

export default function ScrollChapter({
  mangaSlug,
  chapters,
  isLoading = false,
  errorMessage,
}: ScrollChapterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];

  const filteredChapters = chapters.filter((chapter) =>
    chapter.number.includes(searchTerm)
  );

  return (
    <div className="bg-[var(--color-bg-primary)] rounded-xl p-6 shadow-lg border border-white/5 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--color-bg-secondary)]" />
          Chapter List
        </h3>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Filter chapter number..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value.replace(/[^0-9.]/g, ''))}
            className="w-full bg-[var(--color-bg-thirdy)] text-white placeholder-white/30 px-4 py-2 pl-10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-secondary)] border border-white/5 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>

      {firstChapter && latestChapter && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            to={`/readchapter/${mangaSlug}/chapter/${firstChapter.number}`}
            className="bg-[var(--color-bg-thirdy)] hover:bg-[var(--color-bg-secondary)] p-4 rounded-lg border border-white/5 transition-all group text-center"
          >
            <span className="block text-xs text-[var(--color-secondary)] group-hover:text-white/80 mb-1">First Chapter</span>
            <span className="font-bold text-white group-hover:scale-105 inline-block transition-transform">{firstChapter.label}</span>
          </Link>
          <Link
            to={`/readchapter/${mangaSlug}/chapter/${latestChapter.number}`}
            className="bg-[var(--color-bg-secondary)] hover:bg-blue-700 p-4 rounded-lg border border-white/5 transition-all group text-center shadow-[0_0_15px_rgba(39,48,179,0.3)]"
          >
            <span className="block text-xs text-white/70 mb-1">Last Chapter</span>
            <span className="font-bold text-white group-hover:scale-105 inline-block transition-transform">{latestChapter.label}</span>
          </Link>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {isLoading && (
          <div className="text-center py-8 text-[var(--color-secondary)]">Loading chapter list...</div>
        )}

        {!isLoading &&
          !errorMessage &&
          filteredChapters.map((chapter) => (
            <Link
              key={chapter.id}
              to={`/readchapter/${mangaSlug}/chapter/${chapter.number}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-thirdy)]/30 hover:bg-[var(--color-bg-thirdy)] border border-transparent hover:border-[var(--color-bg-secondary)]/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[var(--color-bg-secondary)] font-bold group-hover:text-white transition-colors">
                  {chapter.label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--color-secondary)] hidden sm:block">{chapter.date}</span>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[var(--color-bg-secondary)] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}

        {!isLoading && errorMessage && (
          <div className="text-center py-8 text-red-300">{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && chapters.length === 0 && (
          <div className="text-center py-8 text-[var(--color-secondary)]">No chapters were found for this series.</div>
        )}

        {!isLoading && !errorMessage && chapters.length > 0 && filteredChapters.length === 0 && (
          <div className="text-center py-8 text-[var(--color-secondary)]">
            No chapters found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
